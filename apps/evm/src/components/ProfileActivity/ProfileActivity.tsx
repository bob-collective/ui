import { Flex, P, Skeleton } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useEffect, useMemo, useRef } from 'react';
import { useConfig } from 'wagmi';
import { useStore } from '@tanstack/react-store';
import { watchAccount } from '@wagmi/core';

import { StyledTransactionList } from './ProfileActivity.style';
import { ProfileActivityFilter, StatusFilterOption, TransactionTypeFilterOption } from './ProfileActivityFilter';
import { TransactionItem } from './TransactionItem';

import { useGetBridgeTransactions, useGetGatewayTransactions } from '@/hooks';
import { store } from '@/lib/store';
import { BridgeTransactionStatus, GatewayTransactionType, TransactionType } from '@/types';

const ProfileActivity = (): JSX.Element => {
  const { status = StatusFilterOption.ANY_STATUS, type = TransactionTypeFilterOption.ALL_TRANSACTIONS } = useStore(
    store,
    (state) => state.shared.profile.activityFilters
  );

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

  const dataByType = useMemo(() => {
    switch (type) {
      case TransactionTypeFilterOption.BTC_BRIDGE:
        return gateway.data?.filter((item) => item.subType === GatewayTransactionType.BRIDGE) || [];
      case TransactionTypeFilterOption.STRATEGIES:
        return gateway.data?.filter((item) => item.subType === GatewayTransactionType.STRATEGY) || [];
      case TransactionTypeFilterOption.NATIVE_BRIDGE:
        return bridge.data;
      default:
      case TransactionTypeFilterOption.ALL_TRANSACTIONS:
        return [...bridge.data, ...(gateway?.data || [])];
    }
  }, [bridge.data, gateway.data, type]);

  const dataByStatus = useMemo(() => {
    switch (status) {
      case StatusFilterOption.PENDING:
        return dataByType.filter((item) =>
          item.type === TransactionType.Bridge
            ? item.status !== BridgeTransactionStatus.RELAYED
            : item.status !== 'l2-confirmation'
        );
      case StatusFilterOption.COMPLETE:
        return dataByType.filter((item) =>
          item.type === TransactionType.Bridge
            ? item.status === BridgeTransactionStatus.RELAYED
            : item.status === 'l2-confirmation'
        );
      case StatusFilterOption.FAILED:
        return dataByType.filter((item) =>
          item.type === TransactionType.Bridge ? item.status === BridgeTransactionStatus.FAILED_L1_TO_L2_MESSAGE : false
        );
      case StatusFilterOption.NEEDED_ACTION:
        return dataByType.filter((item) =>
          item.type === TransactionType.Bridge
            ? item.status === BridgeTransactionStatus.READY_TO_PROVE ||
              item.status === BridgeTransactionStatus.READY_FOR_RELAY
            : false
        );

      default:
      case StatusFilterOption.ANY_STATUS:
        return dataByType;
    }
  }, [dataByType, status]);

  const sortedData = useMemo(() => {
    return dataByStatus?.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [dataByStatus]);

  return (
    <Flex direction='column' marginTop='md'>
      <Flex wrap gap='s' justifyContent='flex-end'>
        <ProfileActivityFilter<StatusFilterOption>
          label={<Trans>Status</Trans>}
          options={[
            { children: <Trans>Any Status</Trans>, key: StatusFilterOption.ANY_STATUS },
            { children: <Trans>Pending</Trans>, key: StatusFilterOption.PENDING },
            { children: <Trans>Needed Action</Trans>, key: StatusFilterOption.NEEDED_ACTION },
            { children: <Trans>Complete</Trans>, key: StatusFilterOption.COMPLETE },
            { children: <Trans>Failed</Trans>, key: StatusFilterOption.FAILED }
          ]}
          value={status as StatusFilterOption}
          onSelectionChange={(value) =>
            store.setState((state) => ({
              ...state,
              shared: {
                ...state.shared,
                profile: {
                  ...state.shared.profile,
                  activityFilters: { ...state.shared.profile.activityFilters, status: value }
                }
              }
            }))
          }
        />
        <ProfileActivityFilter<TransactionTypeFilterOption>
          label={<Trans>Transaction type</Trans>}
          options={[
            { children: <Trans>Any Transaction</Trans>, key: TransactionTypeFilterOption.ALL_TRANSACTIONS },
            { children: <Trans>Native Bridge</Trans>, key: TransactionTypeFilterOption.NATIVE_BRIDGE },
            { children: <Trans>BTC Bridge</Trans>, key: TransactionTypeFilterOption.BTC_BRIDGE },
            { children: <Trans>Staking</Trans>, key: TransactionTypeFilterOption.STRATEGIES }
          ]}
          value={type as TransactionTypeFilterOption}
          onSelectionChange={(value) =>
            store.setState((state) => ({
              ...state,
              shared: {
                ...state.shared,
                profile: {
                  ...state.shared.profile,
                  activityFilters: { ...state.shared.profile.activityFilters, type: value }
                }
              }
            }))
          }
        />
      </Flex>
      <StyledTransactionList direction='column' elementType='ul' flex={1} gap='md' marginTop='md'>
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
            {sortedData?.length ? (
              sortedData.map((data, key) => (
                <TransactionItem
                  key={key}
                  data={data}
                  onProveSuccess={bridge.refetch}
                  onRelaySuccess={bridge.refetch}
                />
              ))
            ) : (
              <Flex alignItems='center' gap='md' justifyContent='center' marginY='8xl'>
                <P align='center' size='s'>
                  <Trans>No operations found</Trans>
                </P>
              </Flex>
            )}
          </>
        )}
      </StyledTransactionList>
    </Flex>
  );
};

export { ProfileActivity };
