'use client';

import { Tabs, TabsItem } from '@gobob/ui';
import { Key, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Trans } from '@lingui/macro';

import { Layout } from '../components';
import { TransactionList } from '../components';

import { StakingForm } from './components';
import { useGetStakingStrategies } from './hooks';
import { StyledCard, StyledFlex } from './Stake.style';

import { isProd } from '@/constants';
import { PageLangParam } from '@/i18n/withLigui';
import { useGetGatewayTransactions } from '@/hooks';
import { GatewayTransactionType } from '@/types';

enum Type {
  Stake = 'stake',
  Unstake = 'unstake'
}

const INITIAL_SELECTED_STRATEGY_SLUG = 'solv-solvbtcbbn';

type Props = PageLangParam & {
  searchParams?: { type: Type; 'stake-with': string };
};

function Stake({ searchParams }: Props) {
  const { data: transactions, isPending } = useGetGatewayTransactions({
    query: { select: (data) => data.filter((item) => item.subType === GatewayTransactionType.STAKE) }
  });

  const { data: strategies = [], isLoading: isStrategiesLoading } = useGetStakingStrategies();

  const router = useRouter();

  const urlSearchParams = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const selectedStrategy =
    urlSearchParams.get('stake-with') ??
    (isProd ? INITIAL_SELECTED_STRATEGY_SLUG : strategies[0]?.raw.integration.slug);
  const type = (urlSearchParams.get('type') as Type) || Type.Stake;

  useEffect(() => {
    if (!urlSearchParams.get('type') || !urlSearchParams.get('stake-with')) {
      urlSearchParams.set('type', type);
      if (selectedStrategy) urlSearchParams.set('stake-with', selectedStrategy);

      router.replace('?' + urlSearchParams);
    }
  }, [router, selectedStrategy, type, urlSearchParams]);

  const handleChangeTab = useCallback(
    (key: Key) => {
      urlSearchParams.set('type', key as string);

      router.replace('?' + urlSearchParams);
    },
    [router, urlSearchParams]
  );

  const strategy = useMemo(
    () => strategies.find((strategy) => strategy.raw.integration.slug === selectedStrategy)!,
    [selectedStrategy, strategies]
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
            strategies={strategies}
            strategy={strategy}
            type={type}
            onStrategyChange={(strategySlug) => {
              urlSearchParams.set('stake-with', strategySlug);

              router.replace('?' + urlSearchParams);
            }}
          />
        </StyledCard>
        <TransactionList data={transactions} isInitialLoading={isPending} />
        {/* <StrategyDetails isLoading={isStrategiesLoading} strategy={strategy} /> */}
      </StyledFlex>
    </Layout>
  );
}

export { Stake, Type };
