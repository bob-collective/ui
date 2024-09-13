import { Tabs, TabsItem } from '@gobob/ui';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { Main } from '../../components';

import { StyledCard, StyledFlex } from './Stake.style';
import { BannerCarousel, ProjectsList, StakingForm } from './components';

enum StakeOrigin {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL'
}

const Stake = () => {
  const location = useLocation();

  const [searchParams] = useSearchParams(new URLSearchParams(window.location.search));

  const [type, setType] = useState<'stake' | 'unstake'>((searchParams.get('type') as 'stake') || 'stake');
  const [stakeOrigin, setStakeOrigin] = useState<StakeOrigin>(StakeOrigin.INTERNAL);

  const navigate = useNavigate();

  const handleChangeTab = useCallback((key: any) => {
    setType(key as any);
    setStakeOrigin(key === 'stake' ? StakeOrigin.INTERNAL : StakeOrigin.EXTERNAL);
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
          <StakingForm stakeOrigin={stakeOrigin} ticker={location.state?.ticker} type={type} />
        </StyledCard>
        <ProjectsList />
      </StyledFlex>
    </Main>
  );
};

export { Stake, StakeOrigin };
