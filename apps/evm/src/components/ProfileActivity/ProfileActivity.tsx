import { Button, Flex, P, Skeleton } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useStore } from '@tanstack/react-store';
import { watchAccount } from '@wagmi/core';
import { useEffect, useMemo, useRef } from 'react';
import { useAccount, useConfig } from 'wagmi';

import { StyledTransactionList } from './ProfileActivity.style';
import { ProfileActivityFilters, ProfileActivityFiltersData } from './ProfileActivityFilters';
import { TransactionItem } from './TransactionItem';

import { useGetBridgeTransactions, useGetGatewayTransactions } from '@/hooks';
import { SharedStoreProfileTxStatus, SharedStoreProfileTxType, store } from '@/lib/store';
import {
  BridgeTransaction,
  BridgeTransactionStatus,
  GatewayTransaction,
  GatewayTransactionType,
  TransactionType
} from '@/types';

const filterByType = (
  bridgeData: BridgeTransaction[],
  gatewayData: GatewayTransaction[],
  type?: SharedStoreProfileTxType
) => {
  switch (type) {
    case SharedStoreProfileTxType.BTC_BRIDGE:
      return gatewayData?.filter((item) => item.subType === GatewayTransactionType.BRIDGE) || [];
    case SharedStoreProfileTxType.STRATEGIES:
      return gatewayData?.filter((item) => item.subType === GatewayTransactionType.STRATEGY) || [];
    case SharedStoreProfileTxType.NATIVE_BRIDGE:
      return bridgeData;
    default:
    case SharedStoreProfileTxType.ALL_TRANSACTIONS:
      return [...bridgeData, ...gatewayData];
  }
};

const filterByStatus = (data: Array<BridgeTransaction | GatewayTransaction>, status?: SharedStoreProfileTxStatus) => {
  switch (status) {
    case SharedStoreProfileTxStatus.PENDING:
      return data.filter((item) =>
        item.type === TransactionType.Bridge
          ? item.status !== BridgeTransactionStatus.RELAYED
          : item.status !== 'l2-confirmation'
      );
    case SharedStoreProfileTxStatus.COMPLETE:
      return data.filter((item) =>
        item.type === TransactionType.Bridge
          ? item.status === BridgeTransactionStatus.RELAYED
          : item.status === 'l2-confirmation'
      );
    case SharedStoreProfileTxStatus.FAILED:
      return data.filter((item) =>
        item.type === TransactionType.Bridge ? item.status === BridgeTransactionStatus.FAILED_L1_TO_L2_MESSAGE : false
      );
    case SharedStoreProfileTxStatus.NEEDED_ACTION:
      return data.filter((item) =>
        item.type === TransactionType.Bridge
          ? item.status === BridgeTransactionStatus.READY_TO_PROVE ||
            item.status === BridgeTransactionStatus.READY_FOR_RELAY
          : false
      );
    default:
    case SharedStoreProfileTxStatus.ANY_STATUS:
      return data;
  }
};

const ProfileActivity = (): JSX.Element => {
  const { filters } = useStore(store, (state) => state.shared.profile.transactions);

  const { address: evmAddress } = useAccount();

  const config = useConfig();

  const gateway = useGetGatewayTransactions();
  const bridge = useGetBridgeTransactions();

  const isInitialLoading = useStore(store, (state) => state.bridge.transactions.isInitialLoading);

  const isLoading = gateway.isLoading || bridge.isLoading;

  const watchAccountRef = useRef<() => void>();

  useEffect(() => {
    watchAccountRef.current = watchAccount(config, {
      onChange: (account) => {
        if (account.address) {
          store.setState((state) => ({
            ...state,
            bridge: { ...state.bridge, transactions: { ...state.bridge.transactions, isInitialLoading: true } }
          }));
        }
      }
    });

    // Cleanup by calling unwatch to unsubscribe from the account change event
    return () => watchAccountRef.current?.();
  }, [config]);

  useEffect(() => {
    if (isInitialLoading && !isLoading) {
      store.setState((state) => ({
        ...state,
        bridge: { ...state.bridge, transactions: { ...state.bridge.transactions, isInitialLoading: false } }
      }));
    }
  }, [isInitialLoading, isLoading]);

  const handleFilterSelectionChange = (value: ProfileActivityFiltersData) =>
    store.setState((state) => ({
      ...state,
      shared: {
        ...state.shared,
        profile: {
          ...state.shared.profile,
          transactions: {
            ...state.shared.profile.transactions,
            filters: value
          }
        }
      }
    }));

  const isFiltering = !!(filters.status || filters.type);

  const data = useMemo(() => {
    const filteredByType = filterByType(bridge.data, gateway.data || [], filters.type);

    const filteredByStatus = filterByStatus(filteredByType, filters.status);

    return filteredByStatus?.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [bridge.data, filters.status, filters.type, gateway.data]);

  return (
    <Flex direction='column' marginTop='md'>
      <Flex wrap gap='s' justifyContent='flex-end'>
        <ProfileActivityFilters
          isFiltering={isFiltering}
          value={filters as ProfileActivityFiltersData}
          onSelectionChange={handleFilterSelectionChange}
        />
      </Flex>
      <StyledTransactionList direction='column' elementType='ul' flex={1} marginTop='md'>
        {isInitialLoading ? (
          Array(8)
            .fill(undefined)
            .map((_, idx) => (
              <Flex key={idx} direction='column' elementType='li' gap='xxs' paddingX='md' paddingY='s'>
                <Flex alignItems='center' gap='lg' paddingX='md' paddingY='s'>
                  <Skeleton height='5xl' rounded='full' width='5xl' />
                  <Flex alignItems='flex-start' direction='column'>
                    <Skeleton height='xl' width='8rem' />
                    <Skeleton height='xl' width='10rem' />
                  </Flex>
                </Flex>
                <Skeleton height='xl' width='8rem' />
              </Flex>
            ))
        ) : (
          <>
            {data?.length ? (
              data.map((data, key) => (
                <TransactionItem
                  key={key}
                  data={data}
                  onProveSuccess={bridge.refetch}
                  onRelaySuccess={bridge.refetch}
                />
              ))
            ) : (
              <Flex alignItems='center' direction='column' gap='xl' justifyContent='center' marginY='4xl'>
                <Flex direction='column' gap='s'>
                  <P align='center' size='s'>
                    <Trans>No transactions found</Trans>
                  </P>
                  {!evmAddress && (
                    <P color='grey-50' size='s'>
                      <Trans>Connect your EVM wallet to see your transactions</Trans>
                    </P>
                  )}
                  {isFiltering && (
                    <P color='grey-50' size='s'>
                      <Trans>Try adjusting your filters</Trans>
                    </P>
                  )}
                </Flex>
                {isFiltering && (
                  <Button
                    color='light'
                    size='s'
                    onPress={() => handleFilterSelectionChange({ status: undefined, type: undefined })}
                  >
                    <Trans>Clear Filters</Trans>
                  </Button>
                )}
              </Flex>
            )}
          </>
        )}
      </StyledTransactionList>
    </Flex>
  );
};

export { ProfileActivity };
