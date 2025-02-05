import { toast } from '@gobob/ui';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { sendGAEvent } from '@next/third-parties/google';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SiweMessage } from 'siwe';
import { Address } from 'viem';
import { useAccount, useSignMessage } from 'wagmi';

import { posthogEvents } from '@/lib/posthog';
import { fusionKeys } from '@/lib/react-query';
import { apiClient } from '@/utils';

type UseSignUpProps = {
  onSuccess?: () => void;
};

const useSignUp = ({ onSuccess }: UseSignUpProps = {}) => {
  const { signMessageAsync } = useSignMessage();
  const { chain } = useAccount();

  const { i18n } = useLingui();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: fusionKeys.signUp(),
    mutationFn: async ({
      address,
      turnstileToken
    }: {
      address: Address;
      turnstileToken: string;
      referralCode?: string;
    }) => {
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

      const result = await apiClient.signUp(message, turnstileToken, signature);

      if (!result.ok) throw new Error();

      return result.data;
    },
    onSuccess: (user, { address, referralCode }) => {
      queryClient.setQueryData(fusionKeys.user(), user);

      sendGAEvent('event', 'signup', { evm_address: JSON.stringify(address), referral_code: referralCode });
      onSuccess?.();
      posthogEvents.fusion.signUp();
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
