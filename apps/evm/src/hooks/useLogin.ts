import { UseMutationOptions, useMutation } from '@gobob/react-query';
import { useChainId, useSignMessage } from '@gobob/wagmi';
import { SiweMessage } from 'siwe';

import { apiClient } from '../utils';

const useLogin = ({
  ...props
}: Omit<UseMutationOptions<void, unknown, string, unknown>, 'mutationKey' | 'mutationFn'> = {}) => {
  const { signMessageAsync } = useSignMessage();
  const chainId = useChainId();

  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (address: string) => {
      const nonce = await apiClient.getNonce();

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in to BOB Fusion',
        uri: window.location.origin,
        version: '1',
        chainId: chainId,
        nonce: nonce
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage()
      });

      const res = await apiClient.verify(message, signature);

      if (!res.ok) throw new Error(res?.message || 'Error verifying message');
    },
    ...props
  });
};

export { useLogin };
