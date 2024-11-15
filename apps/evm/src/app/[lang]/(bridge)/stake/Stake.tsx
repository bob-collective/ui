/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Flex } from '@gobob/ui';
import { useEffect, useRef } from 'react';
import { useConfig, watchAccount } from '@gobob/wagmi';
import { useStore } from '@tanstack/react-store';

import { Layout } from '../components';
import { TransactionList } from '../components';
import { GetGatewayTransactionsReturnType, useGetGatewayTransactions } from '../hooks';

import { StakeTable } from './components';

import { store } from '@/lib/store';
import { PageLangParam } from '@/i18n/withLigui';
import { GatewayTransactionType } from '@/types';

type Props = PageLangParam & {
  searchParams?: { receive: string };
};

const select = (data: GetGatewayTransactionsReturnType) =>
  data.filter((item) => item.subType === GatewayTransactionType.STAKE);

function Stake({ searchParams }: Props) {
  const config = useConfig();

  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions
  } = useGetGatewayTransactions({
    query: { select }
  });

  const isInitialLoading = useStore(store, (state) => state.bridge.transactions.isInitialLoading);

  const watchAccountRef = useRef<() => void>();

  useEffect(() => {
    watchAccountRef.current = watchAccount(config, {
      onChange: (account) => {
        if (account.address) {
          store.setState((state) => ({
            ...state,
            stake: { ...state.stake, transactions: { ...state.stake.transactions, isInitialLoading: true } }
          }));
        }
      }
    });

    // Cleanup by calling unwatch to unsubscribe from the account change event
    return () => watchAccountRef.current?.();
  }, [config]);

  useEffect(() => {
    if (isInitialLoading && !isLoadingTransactions) {
      store.setState((state) => ({
        ...state,
        bridge: { transactions: { ...state.bridge.transactions, isInitialLoading: false } }
      }));
    }
  }, [isInitialLoading, isLoadingTransactions]);

  return (
    <Layout>
      <Flex direction='column' gap='xl' marginTop='xl'>
        <StakeTable searchParams={searchParams} onStakeSuccess={refetchTransactions} />
        <TransactionList data={transactions} isInitialLoading={isInitialLoading} />
      </Flex>
    </Layout>
  );
}

export { Stake };
