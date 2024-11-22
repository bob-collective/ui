import { ChainId } from '@gobob/chains';
import { Button, ButtonProps, toast } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { mergeProps } from '@react-aria/utils';
import { useAccount, useSwitchChain } from 'wagmi';

import { useConnectModal } from '@/connect-ui';
import { L1_CHAIN, L2_CHAIN, isValidChain } from '@/constants';
import { useGetUser, useLogin } from '@/hooks';

type LoginButtonProps = ButtonProps;

const LoginButton = (props: LoginButtonProps): JSX.Element => {
  const { switchChainAsync } = useSwitchChain();
  const { open } = useConnectModal();
  const { refetch: refetchUser } = useGetUser({ retry: 5, retryDelay: 1000 });
  const { address, chain } = useAccount();

  const { mutate: login, isPending: isLoadingLogin } = useLogin({
    onSuccess: async () => {
      refetchUser();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => {
      if (e.code === 4001) {
        toast.error(<Trans>User rejected the request</Trans>);
      } else {
        toast.error(e.message || <Trans>Something went wrong. Please try again later.</Trans>);
      }
    }
  });

  const handlePress = async () => {
    if (!address) {
      return open({
        onConnectEvm: async ({ address, connector }) => {
          if (!address) return;
          if (!isValidChain((await connector?.getChainId()) as ChainId)) {
            const chain = await connector?.switchChain?.({ chainId: L2_CHAIN });

            if (!chain) {
              return toast.error(<Trans>Something went wrong. Please try connecting your wallet again.</Trans>);
            }
          }

          return login(address);
        }
      });
    }

    if (!chain || (chain && !isValidChain(chain?.id))) {
      await switchChainAsync?.({ chainId: L1_CHAIN });
    }

    return login(address);
  };

  return <Button loading={isLoadingLogin} {...mergeProps(props, { onPress: handlePress })} />;
};

export { LoginButton };
