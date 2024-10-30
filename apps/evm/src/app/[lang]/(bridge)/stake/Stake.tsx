'use client';

import { Tabs, TabsItem } from '@gobob/ui';
import { Key, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Trans } from '@lingui/macro';

import { Layout } from '../components';
import { TransactionList } from '../components';
import { GetGatewayTransactionsReturnType, useGetGatewayTransactions } from '../hooks';

import { StakingForm } from './components';
import { useGetStakingStrategies } from './hooks';
import { StyledCard, StyledFlex } from './Stake.style';

import { PageLangParam } from '@/i18n/withLigui';
import { GatewayTransactionType, TransactionDirection } from '@/types';

enum Type {
  Stake = 'stake',
  Unstake = 'unstake'
}

type Props = PageLangParam & {
  searchParams?: { type: Type; 'stake-with': string };
};

const select = (data: GetGatewayTransactionsReturnType) =>
  data.filter((item) => item.subType === GatewayTransactionType.STAKE);

function Stake({ searchParams }: Props) {
  const router = useRouter();

  const {
    data: transactions,
    isPending,
    refetch: refetchTransactions
  } = useGetGatewayTransactions({
    query: { select }
  });

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

  const { data: strategies = [] } = useGetStakingStrategies();

  const urlSearchParams = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const type = (urlSearchParams.get('type') as Type) || Type.Stake;
  const direction = type === Type.Stake ? TransactionDirection.L1_TO_L2 : TransactionDirection.L2_TO_L1;

  useEffect(() => {
    if (!urlSearchParams.get('type') || !urlSearchParams.get('stake-with')) {
      urlSearchParams.set('type', type);

      router.replace('?' + urlSearchParams);
    }
  }, [router, type, urlSearchParams]);

  const handleChangeTab = useCallback(
    (key: Key) => {
      urlSearchParams.set('type', key as string);

      router.replace('?' + urlSearchParams);
    },
    [router, urlSearchParams]
  );

  return (
    <Layout>
      <StyledFlex alignItems='flex-start' direction={{ base: 'column', md: 'row' }} gap='2xl' marginTop='xl'>
        <StyledCard>
          <Tabs fullWidth selectedKey={type} size='lg' onSelectionChange={handleChangeTab}>
            <TabsItem key={Type.Stake} title={<Trans>Stake</Trans>}>
              <></>
            </TabsItem>
            <TabsItem key={Type.Unstake} title={<Trans>Unstake</Trans>}>
              <></>
            </TabsItem>
          </Tabs>
          <StakingForm
            key={strategies.length}
            direction={direction}
            strategies={strategies}
            onStakeSuccess={refetchTransactions}
          />
        </StyledCard>
        <TransactionList data={transactions} isInitialLoading={isPending} />
      </StyledFlex>
    </Layout>
  );
}

export { Stake };
