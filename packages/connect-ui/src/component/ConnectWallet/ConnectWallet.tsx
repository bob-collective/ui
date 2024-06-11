import { useAccount as useSatsAccount } from '@gobob/sats-wagmi';
import { SatsConnector } from '@gobob/sats-wagmi';
import { Connector, useAccount, useConnect, Address } from '@gobob/wagmi';
import { Avatar, Button, ButtonProps, Flex, Span } from '@gobob/ui';
import { chain } from '@react-aria/utils';

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
  if (isPending) {
    return 'Authorize Wallet';
  }

  if (connectType === 'evm' && address) {
    return <EvmAddressLabel address={address} elementType='span' />;
  }

  if (!evmConnector && !btcConnector) {
    return 'Connect Wallet';
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
        {btcConnector && <WalletIcon name={btcConnector.name} />}
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
