import { useEffect, useMemo, useRef } from 'react';
import { useStore } from '@tanstack/react-store';
import { useConfig, watchAccount } from '@gobob/wagmi';

import { store } from '../lib/store';

import { BridgeTransaction, useGetBridgeTransactions } from './useGetBridgeTransactions';

import { FeatureFlags, GatewayTransaction, useFeatureFlag, useGetGatewayTransactions } from '.';

type Transaction = BridgeTransaction | GatewayTransaction;

const useGetTransactions = () => {
  const config = useConfig();

  const gateway = useGetGatewayTransactions();
  const bridge = useGetBridgeTransactions();
  const isBtcGatewayEnabled = useFeatureFlag(FeatureFlags.BTC_GATEWAY);

  const isInitialLoading = useStore(store, (state) => state.bridge.transactions.isInitialLoading);

  const isLoading = (isBtcGatewayEnabled && gateway.isLoading) || bridge.isLoading;

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
    let data;

    if (isBtcGatewayEnabled) {
      data = gateway.data && bridge.data ? [...gateway.data, ...bridge.data] : undefined;
    } else {
      data = bridge.data;
    }

    return data?.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [bridge.data, gateway.data, isBtcGatewayEnabled]);

  return {
    data,
    refetchGatewayTxs: gateway.refetch,
    refetchBridgeTxs: bridge.refetch,
    addPlaceholderTransaction: {
      bridge: bridge.addPlaceholderTransaction,
      gateway: gateway.addPlaceholderTransaction
    },
    isPending: (isBtcGatewayEnabled && gateway.isPending) || bridge.isPending,
    isInitialLoading,
    isLoading
  };
};

export { useGetTransactions };
export type { BridgeTransaction, Transaction };
