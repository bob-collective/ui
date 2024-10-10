'use client';

import { useAccount as useSatsAccount } from '@gobob/sats-wagmi';
import { useAccount, useSwitchChain } from '@gobob/wagmi';
import { Button, ButtonProps } from '@gobob/ui';
import { ChainId, getChainName } from '@gobob/chains';
import { useIsClient } from 'usehooks-ts';

import { useConnectModal } from '../..';

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
  const { address, chain } = useAccount();
  const { address: btcAddress } = useSatsAccount();
  const { switchChainAsync, isPending: isSwitchNetworkLoading } = useSwitchChain();
  const isClient = useIsClient();

  const { open, type: connectType } = useConnectModal();

  const inferredProps = { onPress, onClick, disabled, children, type, ...props };

  if (!isClient) {
    const buttonProps = {
      onPress: () => open(),
      children: 'Connect Wallet',
      ...props
    };

    return <Button {...buttonProps} />;
  }

  // Comes first because if the connection includes evm, the priority is always evm
  if (connectType === 'evm' || connectType === 'both') {
    if (!address && isEvmAuthRequired) {
      const buttonProps = {
        onPress: () => open(),
        children: 'Connect Wallet',
        ...props
      };

      return <Button {...buttonProps} />;
    }

    if (isEvmAuthRequired && chainProp && chain?.id !== chainProp) {
      const name = getChainName(chainProp);
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

      const buttonProps = {
        onPress: async (e: any) => {
          await switchChainAsync?.({ chainId: chainProp });

          if (shouldPressAfterSwitch) {
            onPress?.(e);
          }
        },
        children: isSilentSwitch ? children : `Switch to ${capitalizedName}`,
        loading: isSwitchNetworkLoading,
        ...props
      };

      return <Button {...buttonProps} />;
    }
    if (connectType === 'both' && isBtcAuthRequired && !btcAddress) {
      const buttonProps = {
        onPress: () => open(),
        children: 'Connect BTC Wallet',
        ...props
      };

      return <Button {...buttonProps} />;
    }

    return <Button {...inferredProps} />;
  }

  const buttonProps =
    isBtcAuthRequired && !btcAddress
      ? { onPress: () => open(), children: 'Connect BTC Wallet', ...props }
      : inferredProps;

  return <Button {...buttonProps} />;
};

export { AuthButton };
export type { AuthButtonProps };
