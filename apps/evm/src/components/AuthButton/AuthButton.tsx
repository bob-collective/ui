'use client';

import { useDynamicContext, useUserWallets } from '@dynamic-labs/sdk-react-core';
import { ChainId, getChainName } from '@gobob/chains';
import { Button, ButtonProps } from '@gobob/ui';
import { useAccount, useSwitchChain } from '@gobob/wagmi';
import { Trans } from '@lingui/macro';
import { PressEvent } from '@react-aria/interactions';
import { useIsClient } from 'usehooks-ts';

type Props = {
  chain?: ChainId;
  isBtcAuthRequired?: boolean;
  isEvmAuthRequired?: boolean;
  isSilentSwitch?: boolean;
  shouldPressAfterSwitch?: boolean;
};

type InheritAttrs = Omit<ButtonProps, keyof Props>;

type AuthButtonProps = Props & InheritAttrs;

const AuthButton = ({
  onPress,
  onClick,
  disabled,
  children,
  type,
  chain: chainProp,
  isEvmAuthRequired = true,
  isBtcAuthRequired,
  isSilentSwitch,
  shouldPressAfterSwitch,
  ...props
}: AuthButtonProps) => {
  const isClient = useIsClient();

  const { chain } = useAccount();
  const { switchChainAsync, isPending: isSwitchNetworkLoading } = useSwitchChain();

  const { setShowAuthFlow, setSelectedTabIndex } = useDynamicContext();
  const userWallets = useUserWallets();

  if (!isClient) {
    return (
      <Button {...props} loading>
        <Trans>Loading...</Trans>
      </Button>
    );
  }

  const evmWallet = userWallets.find((wallet) => wallet.chain === 'EVM');

  // Comes first because if the connection includes evm, the priority is always evm
  if (isEvmAuthRequired && !evmWallet) {
    const handlePress = (): void => {
      setSelectedTabIndex(1);
      setShowAuthFlow(true);
    };

    return (
      <Button {...props} loading={false} onPress={handlePress}>
        <Trans>Connect Wallet</Trans>
      </Button>
    );
  }

  if (isEvmAuthRequired && chainProp && chain?.id !== chainProp) {
    const name = getChainName(chainProp);
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

    const handlePress = async (e: PressEvent) => {
      await switchChainAsync?.({ chainId: chainProp });

      if (shouldPressAfterSwitch) {
        onPress?.(e);
      }
    };

    return (
      <Button {...props} loading={isSwitchNetworkLoading} onPress={handlePress}>
        {isSilentSwitch ? children : <Trans>Switch to {capitalizedName}</Trans>}
      </Button>
    );
  }

  const btcWallet = userWallets.find((wallet) => wallet.chain === 'BTC');

  if (isBtcAuthRequired && !btcWallet) {
    const handlePress = (): void => {
      console.log('here');
      setSelectedTabIndex(2);
      setShowAuthFlow(true);
    };

    return (
      <Button {...props} loading={false} onPress={handlePress}>
        <Trans>Connect BTC Wallet</Trans>
      </Button>
    );
  }

  return (
    <Button {...props} disabled={disabled} type={type} onClick={onClick} onPress={onPress}>
      {children}
    </Button>
  );
};

export { AuthButton };
export type { AuthButtonProps };
