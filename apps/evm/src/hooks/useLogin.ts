import { toast } from '@gobob/ui';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SiweMessage } from 'siwe';
import { useChainId, useSignMessage } from 'wagmi';
import { sendGAEvent } from '@next/third-parties/google';

import { fusionKeys } from '@/lib/react-query';
import { apiClient } from '@/utils';

const useLogin = () => {
  const { signMessageAsync } = useSignMessage();
  const chainId = useChainId();

  const { i18n } = useLingui();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: fusionKeys.login(),
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

      await apiClient.verify(message, signature);
    },
    onSuccess: async (_, address) => {
      sendGAEvent('event', 'login', { evm_address: JSON.stringify(address) });
      setTimeout(() => queryClient.refetchQueries({ queryKey: fusionKeys.user() }), 1000);
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

export { useLogin };
