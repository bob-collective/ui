'use client';

import { useAccount } from '@gobob/wagmi';
import { useEffect, useMemo, useState } from 'react';

import { FeatureFlags, useFeatureFlag } from '../../../../hooks';

import { BridgeTransaction, useGetBridgeTransactions } from './useGetBridgeTransactions';
import { GatewayTransaction, useGetGatewayTransactions } from './useGetGatewayTransactions';

import { GatewayTransactionType } from '@/types';

type Transaction = BridgeTransaction | GatewayTransaction;

const useGetTransactions = () => {
  const gateway = useGetGatewayTransactions({
    query: { select: (data) => data.filter((item) => item.subType === GatewayTransactionType.BRIDGE) }
  });
  const bridge = useGetBridgeTransactions();
  const isBtcGatewayEnabled = useFeatureFlag(FeatureFlags.BTC_GATEWAY);

  const { address } = useAccount();

  const isLoading = useMemo(
    () => (isBtcGatewayEnabled && gateway.isLoading) || bridge.isLoading,
    [gateway.isLoading, bridge.isLoading, isBtcGatewayEnabled]
  );

  const [isInitialLoading, setInitialLoading] = useState(isLoading);

  useEffect(() => {
    if (isInitialLoading) {
      setInitialLoading(isLoading);
    }
  }, [isLoading, isInitialLoading]);

  useEffect(() => {
    if (address) {
      setInitialLoading(isLoading);
    }
  }, [address, isLoading]);

  return useMemo(() => {
    let data;

    if (isBtcGatewayEnabled) {
      data = gateway.data && bridge.data ? [...gateway.data, ...bridge.data] : undefined;
    } else {
      data = bridge.data;
    }

    return {
      data: data?.sort((a, b) => b.date.getTime() - a.date.getTime()),
      refetchGatewayTxs: gateway.refetch,
      refetchBridgeTxs: bridge.refetch,
      isLoading,
      isInitialLoading
    };
  }, [bridge.data, bridge.refetch, isBtcGatewayEnabled, isInitialLoading, isLoading, gateway.data, gateway.refetch]);
};

export { useGetTransactions };
export type { BridgeTransaction, Transaction };
