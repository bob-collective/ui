import { SatsConnector } from '@gobob/sats-wagmi';
import { Avatar, Flex, List, ListItem, ListProps, Spinner } from '@gobob/ui';
import { useCallback, useMemo } from 'react';
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
  const { i18n } = useLingui();

  let hasBitkeep = undefined;
  let hasOKXWallet = undefined;

  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hasOKXWallet = (window as any).okxTonWallet && window.ethereum;
  }

  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hasBitkeep = (window as any).bitkeep && window.ethereum;
  }

  const walletListItems = useCallback(() => {
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

    // If user does not have Bitkeep installed, offer download link
    if (type === 'evm' && !hasBitkeep) {
      listItems.unshift(
        <ListItem
          key={'bitgetWallet'}
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
    }

    // If user does not have OKX installed, offer download link
    if (type === 'evm' && !hasOKXWallet) {
      listItems.unshift(
        <ListItem
          key={'okxWallet'}
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
    }

    return listItems;
  }, [connectors, hasBitkeep, hasOKXWallet, pendingConnector, type]);

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
      {walletListItems()}
    </List>
  );
};

export { WalletList };
