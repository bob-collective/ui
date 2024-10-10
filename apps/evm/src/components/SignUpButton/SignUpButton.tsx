import { useConnectModal } from '@gobob/connect-ui';
import { Button, ButtonProps, toast } from '@gobob/ui';
import { useAccount, useSwitchChain } from '@gobob/wagmi';
import { mergeProps } from '@react-aria/utils';
import { ChainId } from '@gobob/chains';

import { L2_CHAIN, isValidChain } from '../../constants';
import { useSignUp } from '../../hooks';

type Props = {};

type InheritAttrs = Omit<ButtonProps, keyof Props>;

type SignUpButtonProps = Props & InheritAttrs;

const SignUpButton = (props: SignUpButtonProps): JSX.Element => {
  const { switchChainAsync } = useSwitchChain();
  const { open } = useConnectModal();
  const { address, chain } = useAccount();

  const { mutate: signUp, isPending: isSigningUp } = useSignUp();

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

          return signUp({});
        }
      });
    }

    if (!chain || (chain && !isValidChain(chain?.id))) {
      await switchChainAsync({ chainId: L2_CHAIN });
    }

    return signUp({});
  };

  return <Button loading={isSigningUp} {...mergeProps(props, { onPress: handlePress })} />;
};

export { SignUpButton };
