import { SatsConnector } from '@gobob/sats-wagmi';
import { Avatar, Flex, List, ListItem, ListProps, Spinner } from '@gobob/ui';
import { useMemo } from 'react';
import { Connector } from '@gobob/wagmi';

import { WalletIcon } from '../WalletIcon';

type Props = {
  connector?: SatsConnector | Connector;
  connectors: SatsConnector[] | readonly Connector[];
  pendingConnector?: SatsConnector | Connector;
};

type InheritAttrs = Omit<ListProps, 'children'>;

type WalletListProps = Props & InheritAttrs;

const WalletList = ({ onSelectionChange, pendingConnector, connectors, connector, ...props }: WalletListProps) => {
  const disabledKeys = useMemo(
    () =>
      pendingConnector
        ? connectors.filter((connector) => connector.id !== pendingConnector.id).map((connector) => connector.id)
        : undefined,
    [pendingConnector, connectors]
  );

  return (
    <List
      {...props}
      aria-label='choose available wallets'
      disabledKeys={disabledKeys}
      gap='s'
      selectedKeys={connector ? [connector.id] : []}
      selectionMode='single'
      onSelectionChange={onSelectionChange}
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

export { WalletList };
