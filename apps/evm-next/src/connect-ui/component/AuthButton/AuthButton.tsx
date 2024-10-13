'use client';

import { useAccount as useSatsAccount } from '@gobob/sats-wagmi';
import { useAccount, useSwitchChain } from '@gobob/wagmi';
import { Button, ButtonProps } from '@gobob/ui';
import { ChainId, getChainName } from '@gobob/chains';
import { useIsClient } from 'usehooks-ts';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

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
  const { i18n } = useLingui();

  const { open, type: connectType } = useConnectModal();

  const inferredProps = { onPress, onClick, disabled, children, type, ...props };

  if (!isClient) {
    const buttonProps = {
      onPress: () => open(),
      children: t(i18n)`Loading...`,
      ...props
    };

    return <Button loading {...buttonProps} />;
  }

  // Comes first because if the connection includes evm, the priority is always evm
  if (connectType === 'evm' || connectType === 'both') {
    if (!address && isEvmAuthRequired) {
      const buttonProps = {
        onPress: () => open(),
        children: t(i18n)`Connect Wallet`,
        ...props
      };

      return <Button {...buttonProps} />;
    }

    if (isEvmAuthRequired && chainProp && chain?.id !== chainProp) {
      const name = getChainName(chainProp);
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

      const buttonProps = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onPress: async (e: any) => {
          await switchChainAsync?.({ chainId: chainProp });

          if (shouldPressAfterSwitch) {
            onPress?.(e);
          }
        },
        children: isSilentSwitch ? children : t(i18n)`Switch to ${capitalizedName}`,
        loading: isSwitchNetworkLoading,
        ...props
      };

      return <Button {...buttonProps} />;
    }
    if (connectType === 'both' && isBtcAuthRequired && !btcAddress) {
      const buttonProps = {
        onPress: () => open(),
        children: t(i18n)`Connect BTC Wallet`,
        ...props
      };

      return <Button {...buttonProps} />;
    }

    return <Button {...inferredProps} />;
  }

  const buttonProps =
    isBtcAuthRequired && !btcAddress
      ? { onPress: () => open(), children: t(i18n)`Connect BTC Wallet`, ...props }
      : inferredProps;

  return <Button {...buttonProps} />;
};

export { AuthButton };
export type { AuthButtonProps };
