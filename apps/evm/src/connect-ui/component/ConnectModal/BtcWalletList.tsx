import { SatsConnector } from '@gobob/sats-wagmi';
import { Avatar, Flex, List, ListItem, ListProps, Spinner } from '@gobob/ui';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useMemo } from 'react';

import { WalletIcon } from '../WalletIcon';

type Props = {
  connector?: SatsConnector;
  connectors: SatsConnector[];
  pendingConnector?: SatsConnector;
};

type InheritAttrs = Omit<ListProps, 'children'>;

type BtcWalletListProps = Props & InheritAttrs;

const BtcWalletList = ({
  onSelectionChange,
  pendingConnector,
  connectors,
  connector,
  ...props
}: BtcWalletListProps) => {
  const disabledKeys = useMemo(
    () =>
      pendingConnector
        ? connectors.filter((connector) => connector.id !== pendingConnector.id).map((connector) => connector.id)
        : undefined,
    [pendingConnector, connectors]
  );

  const { i18n } = useLingui();

  return (
    <List
      {...props}
      aria-label={t(i18n)`choose available wallets`}
      disabledKeys={disabledKeys}
      marginTop='md'
      selectedKeys={connector ? [connector.id] : []}
      selectionMode='single'
      onSelectionChange={onSelectionChange}
    >
      {connectors.map((connector) => (
        <ListItem
          key={connector.id}
          alignItems='center'
          gap='xs'
          justifyContent='space-between'
          paddingX='s'
          paddingY='xs'
          textValue={connector.id}
        >
          <Flex alignItems='center' gap='lg'>
            {connector?.icon ? (
              <Avatar rounded='none' src={connector.icon} />
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

export { BtcWalletList };
