import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { Tabs, TabsItem } from '@gobob/ui';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Main } from '../../components';

import { BannerCarousel, StakingForm, StrategyDetails } from './components';
import { useGetStakingStrategies } from './hooks';
import { StyledCard, StyledFlex } from './Stake.style';

enum Type {
  Stake = 'stake',
  Unstake = 'unstake'
}

const Stake = () => {
  const { data: strategies = [], isLoading: isStrategiesLoading } = useGetStakingStrategies();

  const [searchParams] = useSearchParams(new URLSearchParams(window.location.search));

  const [selectedStrategy, setSelectedStrategy] = useState(strategies[0]?.raw.integration.slug);

  if (!selectedStrategy && strategies.length > 0) {
    setSelectedStrategy(strategies[0].raw.integration.slug);
  }

  const [type, setType] = useState((searchParams.get('type') as Type) || Type.Stake);

  const navigate = useNavigate();

  const handleChangeTab = useCallback((key: Key) => {
    setType(key as Type);
  }, []);

  const strategy = useMemo(
    () => strategies.find((strategy) => strategy.raw.integration.slug === selectedStrategy)!,
    [selectedStrategy, strategies]
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    searchParams.set('type', type);
    navigate({ search: searchParams.toString() }, { replace: true });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

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
};

export { Stake, Type };
