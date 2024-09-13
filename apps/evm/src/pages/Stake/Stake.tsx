import { Tabs, TabsItem } from '@gobob/ui';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Main } from '../../components';

import { StyledCard, StyledFlex } from './Stake.style';
import { BannerCarousel, ProjectsList, StakingForm } from './components';

const Stake = () => {
  const [searchParams] = useSearchParams(new URLSearchParams(window.location.search));

  const [type, setType] = useState<'stake' | 'unstake'>((searchParams.get('type') as 'stake') || 'stake');

  const navigate = useNavigate();

  const handleChangeTab = useCallback((key: any) => {
    setType(key as any);
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
            <TabsItem key='stake' title='Stake'>
              <></>
            </TabsItem>
            <TabsItem key='unstake' title='Unstake'>
              <></>
            </TabsItem>
          </Tabs>
          <StakingForm type={type} />
        </StyledCard>
        <ProjectsList />
      </StyledFlex>
    </Main>
  );
};

export { Stake };
