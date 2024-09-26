import { ButtonProps, toast } from '@gobob/ui';
import { useAccount, useSwitchChain } from '@gobob/wagmi';
import { Button } from '@gobob/ui';
import { useConnectModal } from '@gobob/connect-ui';
import { mergeProps } from '@react-aria/utils';
import { ChainId } from '@gobob/chains';

import { L2_CHAIN, isValidChain } from '../../constants';
import { useGetUser, useLogin } from '../../hooks';

type Props = { onLogin?: () => void };

type InheritAttrs = Omit<ButtonProps, keyof Props>;

type LoginButtonProps = Props & InheritAttrs;

const LoginButton = ({ onLogin, ...props }: LoginButtonProps): JSX.Element => {
  const { switchChainAsync } = useSwitchChain();
  const { open } = useConnectModal();
  const { refetch: refetchUser } = useGetUser({ retry: 5, retryDelay: 1000 });
  const { address, chain } = useAccount();

  const { mutate: login, isPending: isLoadingLogin } = useLogin({
    onSuccess: async () => {
      refetchUser();
      onLogin?.();
    },
    onError: (e: any) => {
      if (e.code === 4001) {
        toast.error('User rejected the request');
      } else {
        toast.error(e.message || 'Something went wrong. Please try again later.');
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
              return toast.error('Something went wrong. Please try connecting your wallet again.');
            }
          }

          return login(address);
        }
      });
    }

    if (!chain || (chain && !isValidChain(chain?.id))) {
      await switchChainAsync({ chainId: L2_CHAIN });
    }

    return login(address);
  };

  return <Button loading={isLoadingLogin} {...mergeProps(props, { onPress: handlePress })} />;
};

export { LoginButton };
