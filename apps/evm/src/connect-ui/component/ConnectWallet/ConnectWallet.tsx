'use client';

import { SatsConnector, useAccount as useSatsAccount } from '@gobob/sats-wagmi';
import { Avatar, Button, ButtonProps, Flex, Skeleton, Span } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { chain } from '@react-aria/utils';
import { useIsClient } from 'usehooks-ts';
import { Connector, useAccount, useConnect } from 'wagmi';
import { Address } from 'viem';

import { useConnectModal } from '../../providers';
import { ConnectType } from '../../types';
import { EvmAddressLabel } from '../EvmAddressLabel';
import { WalletIcon } from '../WalletIcon';

import { StyledWallets } from './ConnectWallet.style';

const Label = ({
  address,
  isPending,
  btcConnector,
  evmConnector,
  connectType
}: {
  address?: Address;
  isPending?: boolean;
  evmConnector?: Connector;
  btcConnector?: SatsConnector;
  connectType: ConnectType;
}) => {
  const isClient = useIsClient();

  if (!isClient) return <Skeleton height='3xl' width='9xl' />;

  if (!evmConnector && !btcConnector) return <Trans>Connect Wallet</Trans>;

  if (isPending) return <Trans>Authorize Wallet</Trans>;

  if (connectType === 'evm' && address) {
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
        {btcConnector &&
          (btcConnector.icon ? (
            <Avatar rounded='none' size='2xl' src={btcConnector.icon} />
          ) : (
            <WalletIcon name={btcConnector.name} />
          ))}
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
  const { connector: btcConnector } = useSatsAccount();
  const { open, type: connectType } = useConnectModal();

  return (
    <Button loading={isPending} variant={variant} onPress={chain(open, onPress)} {...props}>
      <Label
        address={address}
        btcConnector={btcConnector}
        connectType={connectType}
        evmConnector={evmConnector}
        isPending={isPending}
      />
    </Button>
  );
};

export { ConnectWallet };
export type { ConnectWalletProps };
