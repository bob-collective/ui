'use client';

import { useAccount as useSatsAccount } from '@gobob/sats-wagmi';
import { SatsConnector } from '@gobob/sats-wagmi';
import { Connector, useAccount, useConnect, Address } from '@gobob/wagmi';
import { Avatar, Button, ButtonProps, Flex, Skeleton, Span } from '@gobob/ui';
import { chain } from '@react-aria/utils';
import { useIsClient } from 'usehooks-ts';

import { EvmAddressLabel } from '../EvmAddressLabel';
import { WalletIcon } from '../WalletIcon';
import { useConnectModal } from '../../providers';
import { ConnectType } from '../../types';

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

  if (!evmConnector && !btcConnector) return 'Connect Wallet';

  if (isPending) return 'Authorize Wallet';

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
        Wallet
      </Span>
    </Flex>
  );
};

type Props = {};

type InheritAttrs = Omit<ButtonProps, keyof Props>;

type ConnectWalletProps = Props & InheritAttrs;

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
