'use client';

import { Avatar, Button, ButtonProps, Flex, Skeleton, Span } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { chain } from '@react-aria/utils';
import { useIsClient } from 'usehooks-ts';
import { Address } from 'viem';
import { Connector, useAccount, useConnect } from 'wagmi';

import { useDynamicContext, useUserWallets } from '@dynamic-labs/sdk-react-core';

import { EvmAddressLabel } from '../EvmAddressLabel';
import { WalletIcon } from '../WalletIcon';

import { StyledWallets } from './ConnectWallet.style';

const Label = ({
  address,
  isPending,
  evmConnector
}: {
  address?: Address;
  isPending?: boolean;
  evmConnector?: Connector;
}) => {
  const isClient = useIsClient();

  const userWallets = useUserWallets();

  const evmWallet = userWallets.find((wallet) => wallet.chain === 'EVM');

  const btcWallet = userWallets.find((wallet) => wallet.chain === 'BTC');

  if (!isClient) return <Skeleton height='3xl' width='9xl' />;

  if (!evmWallet && !btcWallet) return <Trans>Connect Wallet</Trans>;

  if (isPending) return <Trans>Authorize Wallet</Trans>;

  if (address) {
    return <EvmAddressLabel address={address} elementType='span' />;
  }

  return (
    <Flex alignItems='center' elementType='span' gap='s'>
      <StyledWallets alignItems='center'>
        {evmConnector &&
          (evmConnector.icon ? (
            <Avatar rounded='none' size='2xl' src={evmConnector.icon} />
          ) : (
            <WalletIcon name={evmConnector.name} />
          ))}
        {btcWallet && <WalletIcon name={btcWallet.connector.name} />}
      </StyledWallets>
      <Span size='s' weight='medium'>
        <Trans>Wallet</Trans>
      </Span>
    </Flex>
  );
};

type ConnectWalletProps = ButtonProps;

const ConnectWallet = ({ onPress, variant = 'outline', ...props }: ConnectWalletProps): JSX.Element => {
  const { isPending } = useConnect();
  const { connector: evmConnector, address } = useAccount();
  const { setShowDynamicUserProfile } = useDynamicContext();

  return (
    <Button
      loading={isPending}
      variant={variant}
      onPress={chain(() => setShowDynamicUserProfile(true), onPress)}
      {...props}
    >
      <Label address={address} evmConnector={evmConnector} isPending={isPending} />
    </Button>
  );
};

export { ConnectWallet };
export type { ConnectWalletProps };
