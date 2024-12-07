import { Avatar, Flex, List, ListItem, ListProps, Spinner } from '@gobob/ui';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Connector } from 'wagmi';

import { WalletIcon } from '../WalletIcon';

enum WalletId {
  OkexWallet = 'com.okex.wallet',
  CoinbaseWalletSDK = 'coinbaseWalletSDK',
  CoinbaseWallet = 'com.coinbase.wallet',
  MetaMaskMobile = 'io.metamask'
}

type PlaceholderConnector = {
  id: string;
  name: string;
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any;
};

const okxPlaceholder: PlaceholderConnector = {
  id: WalletId.OkexWallet,
  name: 'OKX Wallet',
  href: 'https://www.okx.com/web3'
};

type Props = {
  connector?: Connector;
  connectors: readonly Connector[];
  pendingConnector?: Connector;
};

type InheritAttrs = Omit<ListProps, 'children'>;

type EvmWalletListProps = Props & InheritAttrs;

const EvmWalletList = ({
  onSelectionChange,
  pendingConnector,
  connectors: connectorsProp,
  connector,
  ...props
}: EvmWalletListProps) => {
  const { i18n } = useLingui();

  const okxConnector = connectorsProp.find((c) => c.id === WalletId.OkexWallet) || okxPlaceholder;

  const hasCoinbaseConnector = connectorsProp.some((el) => el.id === WalletId.CoinbaseWallet);

  const wagmiConnectors = connectorsProp.filter(
    (c) => !((c.id === WalletId.CoinbaseWalletSDK && hasCoinbaseConnector) || c.id === okxConnector.id)
  );

  const connectors = [okxConnector, ...wagmiConnectors];

  const disabledKeys = pendingConnector
    ? connectors.filter((c) => c.id !== pendingConnector.id).map((c) => c.id)
    : undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectionChange = (key: any) => {
    const [selectedKey] = [...key];

    if (selectedKey === WalletId.OkexWallet && !connectorsProp.some((c) => c.id === WalletId.OkexWallet)) {
      window.open(okxPlaceholder.href, '_blank', 'noreferrer');
    } else {
      onSelectionChange?.(key);
    }
  };

  return (
    <List
      {...props}
      aria-label={t(i18n)`choose available wallets`}
      disabledKeys={disabledKeys}
      gap='s'
      selectedKeys={connector ? [connector.id] : []}
      selectionMode='single'
      onSelectionChange={handleSelectionChange}
    >
      {connectors.map((connector) => (
        <ListItem
          key={connector.id}
          alignItems='center'
          gap='lg'
          justifyContent='space-between'
          paddingX='s'
          paddingY='xs'
          textValue={connector.id}
        >
          <Flex alignItems='center' gap='lg'>
            {(connector as Connector)?.icon ? (
              <Avatar rounded='none' src={(connector as Connector).icon} />
            ) : (
              <WalletIcon name={connector.name} size='xl' />
            )}
            {connector.name}
          </Flex>
          {connector.id === pendingConnector?.id && <Spinner />}
        </ListItem>
      ))}
    </List>
  );
};

export { EvmWalletList };
