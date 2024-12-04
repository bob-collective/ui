'use client';

import { useStore } from '@tanstack/react-store';
import { watchAccount } from '@wagmi/core';
import { useEffect, useMemo, useRef } from 'react';
import { useConfig } from 'wagmi';

import { useGetBridgeTransactions, useGetGatewayTransactions } from '@/app/[lang]/(bridge)/hooks';
import { store } from '@/lib/store';

const useGetTransactions = () => {
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
    txPendingUserAction: bridge.txPendingUserAction,
    isInitialLoading,
    isLoading
  };
};

export { useGetTransactions };
