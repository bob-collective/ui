import { useEffect, useMemo, useState } from 'react';
import { useAccount } from '@gobob/wagmi';

import { FeatureFlags, useFeatureFlag } from '../../../hooks';

import { OnRampTransaction, useGetOnRampTransactions } from './useGetOnRampTransactions';
import { BridgeTransaction, useGetBridgeTransactions } from './useGetBridgeTransactions';

type Transaction = BridgeTransaction | OnRampTransaction;

const useGetTransactions = () => {
  const onramp = useGetOnRampTransactions();
  const bridge = useGetBridgeTransactions();
  const isBtcOnRampEnabled = useFeatureFlag(FeatureFlags.BTC_ONRAMP);

  const { address } = useAccount();

  const isLoading = useMemo(
    () => (isBtcOnRampEnabled && onramp.isLoading) || bridge.isLoading,
    [onramp.isLoading, bridge.isLoading, isBtcOnRampEnabled]
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

    if (isBtcOnRampEnabled) {
      data = onramp.data && bridge.data ? [...onramp.data, ...bridge.data] : undefined;
    } else {
      data = bridge.data;
    }

    return {
      data: data?.sort((a, b) => b.date.getTime() - a.date.getTime()),
      refetchOnRampTxs: onramp.refetch,
      refetchBridgeTxs: bridge.refetch,
      isLoading,
      isInitialLoading
    };
  }, [bridge.data, bridge.refetch, isBtcOnRampEnabled, isInitialLoading, isLoading, onramp.data, onramp.refetch]);
};

export { useGetTransactions };
export type { Transaction, BridgeTransaction, OnRampTransaction };
