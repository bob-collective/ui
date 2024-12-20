import { ChainId } from '@gobob/chains';
import { Button, ButtonProps, toast } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { mergeProps } from '@react-aria/utils';
import { useAccount, useSwitchChain } from 'wagmi';

import { useConnectModal } from '@/connect-ui';
import { L2_CHAIN, isValidChain } from '@/constants';
import { useSignUp } from '@/hooks';

type SignUpButtonProps = ButtonProps;

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
              return toast.error(<Trans>Something went wrong. Please try connecting your wallet again.</Trans>);
            }
          }

          return signUp({ address });
        }
      });
    }

    if (!chain || (chain && !isValidChain(chain?.id))) {
      await switchChainAsync({ chainId: L2_CHAIN });
    }

    return signUp({ address });
  };

  return <Button loading={isSigningUp} {...mergeProps(props, { onPress: handlePress })} />;
};

export { SignUpButton };
