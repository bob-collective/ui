import { ButtonProps, toast } from '@gobob/ui';
import { useAccount, useSwitchChain } from '@gobob/wagmi';
import { Button } from '@gobob/ui';
import { useConnectModal } from '@gobob/connect-ui';
import { mergeProps } from '@react-aria/utils';

import { L1_CHAIN, isValidChain } from '@/constants';
import { useGetUser, useLogin } from '@/hooks';

type Props = object;

type InheritAttrs = Omit<ButtonProps, keyof Props>;

type LoginButtonProps = Props & InheritAttrs;

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
        toast.error('User rejected the request');
      } else {
        toast.error(e.message || 'Something went wrong. Please try again later.');
      }
    }
  });

  const handlePress = async () => {
    if (!address) {
      return open();
    }

    if (!chain || (chain && !isValidChain(chain?.id))) {
      await switchChainAsync?.({ chainId: L1_CHAIN });
    }

    return login(address);
  };

  return <Button loading={isLoadingLogin} {...mergeProps(props, { onPress: handlePress })} />;
};

export { LoginButton };
