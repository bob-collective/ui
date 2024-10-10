'use client';

import { Tabs, TabsItem } from '@gobob/ui';
import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { BannerCarousel, StakingForm, StrategyDetails } from './components';
import { useGetStakingStrategies } from './hooks';
import { StyledCard, StyledFlex } from './Stake.style';

import { isProd } from '@/constants';
import { Main } from '@/components';

enum Type {
  Stake = 'stake',
  Unstake = 'unstake'
}

const INITIAL_SELECTED_STRATEGY_SLUG = 'solv-solvbtcbbn';

interface Props {
  searchParams: { type: Type; stakeWith: string };
}

function Stake({ searchParams }: Props) {
  const { data: strategies = [], isLoading: isStrategiesLoading } = useGetStakingStrategies();

  const router = useRouter();

  const urlSearchParams = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const [selectedStrategy, setSelectedStrategy] = useState(
    urlSearchParams.get('stakeWith') ?? (isProd ? INITIAL_SELECTED_STRATEGY_SLUG : strategies[0]?.raw.integration.slug)
  );

  if (!selectedStrategy && strategies.length > 0) {
    setSelectedStrategy(strategies[0].raw.integration.slug);
  }

  const [type, setType] = useState((urlSearchParams.get('type') as Type) || Type.Stake);

  const handleChangeTab = useCallback((key: Key) => {
    setType(key as Type);
  }, []);

  const strategy = useMemo(
    () => strategies.find((strategy) => strategy.raw.integration.slug === selectedStrategy)!,
    [selectedStrategy, strategies]
  );

  useEffect(() => {
    urlSearchParams.set('type', type);
    if (selectedStrategy) urlSearchParams.set('stakeWith', selectedStrategy);

    router.replace('?' + urlSearchParams);
  }, [type, selectedStrategy, router, urlSearchParams]);

  return (
    <Main maxWidth='5xl' padding='md'>
      <BannerCarousel />
      <StyledFlex alignItems='flex-start' direction={{ base: 'column', md: 'row' }} gap='2xl' marginTop='xl'>
        <StyledCard>
          <Tabs fullWidth selectedKey={type} size='lg' onSelectionChange={handleChangeTab}>
            <TabsItem key={Type.Stake} title='Stake'>
              <></>
            </TabsItem>
            <TabsItem key={Type.Unstake} title='Unstake'>
              <></>
            </TabsItem>
          </Tabs>
          <StakingForm
            key={strategies.length}
            strategies={strategies}
            strategy={strategy}
            type={type}
            onStrategyChange={setSelectedStrategy}
          />
        </StyledCard>
        <StrategyDetails isLoading={isStrategiesLoading} strategy={strategy} />
      </StyledFlex>
    </Main>
  );
}

export { Stake, Type };
