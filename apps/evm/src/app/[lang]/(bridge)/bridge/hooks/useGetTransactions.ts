'use client';

import { useConfig, watchAccount } from '@gobob/wagmi';
import { useEffect, useMemo, useRef } from 'react';
import { useStore } from '@tanstack/react-store';

import { GetGatewayTransactionsReturnType, useGetBridgeTransactions, useGetGatewayTransactions } from '../../hooks';

import { store } from '@/lib/store';
import { GatewayTransactionType } from '@/types';

const select = (data: GetGatewayTransactionsReturnType) =>
  data.filter((item) => item.subType === GatewayTransactionType.BRIDGE);

const useGetTransactions = () => {
  const config = useConfig();
  const gateway = useGetGatewayTransactions({
    query: { select }
  });
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
            bridge: { transactions: { ...state.bridge.transactions, isInitialLoading: true } }
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
        bridge: { transactions: { ...state.bridge.transactions, isInitialLoading: false } }
      }));
    }
  }, [isInitialLoading, isLoading]);

  const data = useMemo(() => {
    const data = [...(gateway.data || []), ...bridge.data];

    return data?.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [bridge.data, gateway.data]);

  return {
    data,
    refetch: {
      gateway: gateway.refetch,
      bridge: bridge.refetch
    },
    addPlaceholderTransaction: {
      bridge: bridge.addPlaceholderTransaction
    },
    isPending: gateway.isPending || bridge.isPending,
    isInitialLoading,
    isLoading
  };
};

export { useGetTransactions };
