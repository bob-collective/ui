import { toast } from '@gobob/ui';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useMutation } from '@tanstack/react-query';
import { SiweMessage } from 'siwe';
import { Address } from 'viem';
import { useAccount, useSignMessage } from 'wagmi';
import { sendGTMEvent } from '@next/third-parties/google';

import { useGetUser } from './useGetUser';

import { fusionKeys } from '@/lib/react-query';
import { apiClient } from '@/utils';

const useSignUp = () => {
  const { signMessageAsync } = useSignMessage();
  const { chain } = useAccount();

  const { refetch: refetchUser } = useGetUser();

  const { i18n } = useLingui();

  return useMutation({
    mutationKey: fusionKeys.signUp(),
    mutationFn: async (address: Address) => {
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

      await apiClient.signUp(message, signature);
    },
    onSuccess: (_, address) => {
      sendGTMEvent({ event: 'signup', walletAddress: address });
      setTimeout(() => refetchUser(), 100);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => {
      if (e.code === 4001) {
        toast.error(t(i18n)`User rejected the request`);
      } else {
        toast.error(e.message || t(i18n)`Something went wrong. Please try again later.`);
      }
    }
  });
};

export { useSignUp };
