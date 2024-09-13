import { H2, Tabs, TabsItem } from '@gobob/ui';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { Main } from '../../components';

import { StyledCard, StyledFlex } from './Stake.style';
import { ProjectsList, StakingForm } from './components';

enum StakeOrigin {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL'
}

const Stake = () => {
  const location = useLocation();
  const { t } = useTranslation();

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
      <StyledFlex
        alignItems='flex-start'
        direction={{ base: 'column', md: 'row' }}
        gap={{ base: 'none', md: '2xl' }}
        marginTop='xl'
      >
        <StyledFlex direction='column' flex={1} gap='4xl'>
          <H2 size='3xl'>{t('staking.form.title')}</H2>
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
        </StyledFlex>
        <StyledFlex direction='column' flex={1} gap='4xl' marginTop={{ base: '5xl', md: 'none' }}>
          <H2 size='3xl'>{t('staking.projects.title')}</H2>
          <ProjectsList />
        </StyledFlex>
      </StyledFlex>
    </Main>
  );
};

export { Stake, StakeOrigin };
