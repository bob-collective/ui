import { SatsConnector } from '@gobob/sats-wagmi';
import { Avatar, Flex, List, ListItem, ListProps, Spinner } from '@gobob/ui';
import { useEffect, useMemo, useState } from 'react';
import { Connector } from '@gobob/wagmi';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { WalletIcon } from '../WalletIcon';

import { OKXWalletLink, BitgetWalletLink } from './walletLinks';

type Props = {
  connector?: SatsConnector | Connector;
  connectors: SatsConnector[] | readonly Connector[];
  pendingConnector?: SatsConnector | Connector;
  type: string;
};

type InheritAttrs = Omit<ListProps, 'children'>;

type WalletListProps = Props & InheritAttrs;

const WalletList = ({
  onSelectionChange,
  pendingConnector,
  connectors,
  connector,
  type,
  ...props
}: WalletListProps) => {
  const disabledKeys = useMemo(
    () =>
      pendingConnector
        ? connectors.filter((connector) => connector.id !== pendingConnector.id).map((connector) => connector.id)
        : undefined,
    [pendingConnector, connectors]
  );
  const [hasBitkeep, setHasBitKeep] = useState(false);
  const [hasOkxWallet, setHasOkxWallet] = useState(false);
  const { i18n } = useLingui();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const okxWalletInstalled = !!window.okxTonWallet && !!window.ethereum;
      const bitkeepWalletInstalled = !!window.bitkeep && !!window.ethereum;

      setHasBitKeep(bitkeepWalletInstalled);
      setHasOkxWallet(okxWalletInstalled);
    }
  }, []);

  const walletListItems = useMemo(() => {
    const listItems = connectors.map((connector) => (
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
    ));

    const bitkeepItem = (
      <ListItem
        key='bitgetWallet'
        alignItems='center'
        gap='lg'
        justifyContent='space-between'
        paddingX='s'
        paddingY='xs'
        textValue='Bitget Wallet'
      >
        <Flex alignItems='center' gap='lg'>
          <BitgetWalletLink />
        </Flex>
      </ListItem>
    );

    const okxItem = (
      <ListItem
        key='okxWallet'
        alignItems='center'
        gap='lg'
        justifyContent='space-between'
        paddingX='s'
        paddingY='xs'
        textValue='OKX Wallet'
      >
        <Flex alignItems='center' gap='lg'>
          <OKXWalletLink />
        </Flex>
      </ListItem>
    );

    return [
      ...(type === 'evm' && !hasOkxWallet ? [okxItem] : []),
      ...(type === 'evm' && !hasBitkeep ? [bitkeepItem] : []),
      ...listItems
    ];
  }, [connectors, hasBitkeep, hasOkxWallet, pendingConnector, type]);

  return (
    <List
      {...props}
      aria-label={t(i18n)`choose available wallets`}
      disabledKeys={disabledKeys}
      gap='s'
      selectedKeys={connector ? [connector.id] : []}
      selectionMode='single'
      onSelectionChange={onSelectionChange}
    >
      {walletListItems}
    </List>
  );
};

export { WalletList };
