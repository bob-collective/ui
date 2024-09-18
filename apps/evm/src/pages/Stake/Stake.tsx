import { Tabs, TabsItem } from '@gobob/ui';
import { Key, useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Main } from '../../components';

import { useGetStakingStrategies } from './hooks';
import { StyledCard, StyledFlex } from './Stake.style';
import { BannerCarousel, StrategiesList, StakingForm } from './components';

enum Type {
  Stake = 'stake',
  Unstake = 'unstake'
}

const Stake = () => {
  const [searchParams] = useSearchParams(new URLSearchParams(window.location.search));

  const { data: strategies = [], isLoading: isStrategiesLoading } = useGetStakingStrategies();

  const [type, setType] = useState((searchParams.get('type') as Type) || Type.Stake);

  const navigate = useNavigate();

  const handleChangeTab = useCallback((key: Key) => {
    setType(key as Type);
  }, []);

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
          <StakingForm strategies={strategies} type={type} />
        </StyledCard>
        <StrategiesList isLoading={isStrategiesLoading} strategies={strategies} />
      </StyledFlex>
    </Main>
  );
};

export { Stake, Type };
