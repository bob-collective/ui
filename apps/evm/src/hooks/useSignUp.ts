import { useMutation, UseMutationOptions } from '@gobob/react-query';
import { toast } from '@gobob/ui';
import { useAccount, useSignMessage } from '@gobob/wagmi';
import { chain as chainFn } from '@react-aria/utils';
import { SiweMessage } from 'siwe';

import { signUpKeys } from '../lib/react-query';
import { apiClient } from '../utils';

import { useGetUser } from './useGetUser';

const useSignUp = ({
  onSuccess,
  onError
}: Pick<UseMutationOptions<void, any, any, unknown>, 'onSuccess' | 'onError'> = {}) => {
  const { signMessageAsync } = useSignMessage();
  const { address, chain } = useAccount();

  const { refetch: refetchUser } = useGetUser();

  return useMutation({
    mutationKey: signUpKeys.signUp(),
    mutationFn: async () => {
      const nonce = await apiClient.getNonce();

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in to BOB Fusion',
        uri: window.location.origin,
        version: '1',
        chainId: chain?.id,
        nonce: nonce
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage()
      });

      const res = await apiClient.signUp(message, signature);

      if (!res.ok) throw new Error(res?.message || 'Error verifying message');
    },
    onSuccess: chainFn(onSuccess, refetchUser),
    onError: chainFn(onError, (e: any) => {
      if (e.code === 4001) {
        toast.error('User rejected the request');
      } else {
        toast.error(e?.message || 'Something went wrong. Please try again later.');
      }
    })
  });
};

export { useSignUp };
