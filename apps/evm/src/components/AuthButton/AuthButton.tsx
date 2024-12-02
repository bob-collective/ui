'use client';

import { useDynamicContext, useDynamicModals } from '@dynamic-labs/sdk-react-core';
import { ChainId, getChainName } from '@gobob/chains';
import { Button, ButtonProps } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useIsClient } from 'usehooks-ts';
import { useAccount, useSwitchChain } from 'wagmi';

import { useBtcAccount } from '@/hooks';

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

  const { chain, address: evmAddress } = useAccount();
  const { switchChainAsync, isPending: isSwitchNetworkLoading } = useSwitchChain();

  const { setShowAuthFlow, setSelectedTabIndex } = useDynamicContext();
  const { setShowLinkNewWalletModal } = useDynamicModals();

  const { address: btcAddress } = useBtcAccount();

  if (!isClient) {
    return (
      <Button {...props} loading>
        <Trans>Loading...</Trans>
      </Button>
    );
  }

  // Comes first because if the connection includes evm, the priority is always evm
  if (isEvmAuthRequired && !evmAddress) {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePress = async (e: any) => {
      switchChainAsync?.({ chainId: chainProp });

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

  if (isBtcAuthRequired && !btcAddress) {
    const handlePress = (): void => {
      setSelectedTabIndex(2);
      setShowLinkNewWalletModal(true);
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
