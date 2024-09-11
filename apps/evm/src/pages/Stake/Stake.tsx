import { ChainId, getChainIdByChainName, getChainName } from '@gobob/chains';
import { H2, Tabs, TabsItem } from '@gobob/ui';
import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { Main } from '../../components';
import { L1_CHAIN, L2_CHAIN } from '../../constants';

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

  const initialChain = useMemo(() => {
    const network = searchParams.get('network');

    if (!network) {
      return L1_CHAIN;
    }

    if (network === 'bitcoin') {
      return 'BTC';
    }

    return getChainIdByChainName(network) || L1_CHAIN;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [chain, setChain] = useState<ChainId | 'BTC'>(initialChain);

  const navigate = useNavigate();

  // const [isFaultProofNoticeHidden, setFaultProofNoticeHidden] = useLocalStorage(
  //   LocalStorageKey.HIDE_FAULT_PROOFS_NOTICE
  // );

  const handleChangeTab = useCallback((key: any) => {
    setType(key as any);
    setStakeOrigin(key === 'stake' ? StakeOrigin.INTERNAL : StakeOrigin.EXTERNAL);
    setChain(L1_CHAIN);
  }, []);

  const handleChangeNetwork = useCallback(
    (network: Key) => {
      if (network === 'BTC') {
        return setStakeOrigin(StakeOrigin.INTERNAL);
      }

      if (type === 'stake' ? network !== L1_CHAIN : network !== L2_CHAIN) {
        setStakeOrigin(StakeOrigin.EXTERNAL);
      } else {
        setStakeOrigin(StakeOrigin.INTERNAL);
      }
    },
    [type]
  );

  const handleChangeOrigin = useCallback((origin: StakeOrigin) => setStakeOrigin(origin), []);

  const handleChangeChain = useCallback((chain: ChainId | 'BTC') => setChain(chain), []);

  // const handleCloseFaultProofNotice = useCallback(() => {
  //   setFaultProofNoticeHidden(true);
  // }, [setFaultProofNoticeHidden]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    searchParams.set('type', type);
    navigate({ search: searchParams.toString() }, { replace: true });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const network = chain === 'BTC' ? 'bitcoin' : getChainName(chain);

    searchParams.set('network', network);
    navigate({ search: searchParams.toString() }, { replace: true });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain]);

  useEffect(() => {
    if (location?.state?.setBridgeToBtc) {
      setChain('BTC');
      setStakeOrigin(StakeOrigin.INTERNAL);
    }
  }, [location]);

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
            <StakingForm
              chain={chain}
              stakeOrigin={stakeOrigin}
              ticker={location.state?.ticker}
              type={type}
              onChangeChain={handleChangeChain}
              onChangeNetwork={handleChangeNetwork}
              onChangeOrigin={handleChangeOrigin}
            />
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
