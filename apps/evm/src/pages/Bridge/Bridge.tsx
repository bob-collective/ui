import { ChainId, getChainIdByChainName, getChainName } from '@gobob/chains';
import { Tabs, TabsItem } from '@gobob/ui';
import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { Main } from '../../components';
import { L1_CHAIN, L2_CHAIN } from '../../constants';

import { StyledCard, StyledFlex } from './Bridge.style';
import { BannerCarousel, BridgeForm, TransactionList } from './components';

enum BridgeOrigin {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL'
}

const Bridge = () => {
  const location = useLocation();

  const [searchParams] = useSearchParams(new URLSearchParams(window.location.search));

  const [type, setType] = useState<'deposit' | 'withdraw'>((searchParams.get('type') as 'deposit') || 'deposit');
  const [bridgeOrigin, setBridgeOrigin] = useState<BridgeOrigin>(BridgeOrigin.INTERNAL);

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
    setBridgeOrigin(key === 'deposit' ? BridgeOrigin.INTERNAL : BridgeOrigin.EXTERNAL);
    setChain(L1_CHAIN);
  }, []);

  const handleChangeNetwork = useCallback(
    (network: Key) => {
      if (network === 'BTC') {
        return setBridgeOrigin(BridgeOrigin.INTERNAL);
      }

      if (type === 'deposit' ? network !== L1_CHAIN : network !== L2_CHAIN) {
        setBridgeOrigin(BridgeOrigin.EXTERNAL);
      } else {
        setBridgeOrigin(BridgeOrigin.INTERNAL);
      }
    },
    [type]
  );

  const handleChangeOrigin = useCallback((origin: BridgeOrigin) => setBridgeOrigin(origin), []);

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
      setBridgeOrigin(BridgeOrigin.INTERNAL);
    }
  }, [location]);

  return (
    <>
      <Main maxWidth='5xl' padding='md'>
        <BannerCarousel />

        {/* {!isFaultProofNoticeHidden && (
          <Alert marginTop='xl' status='info' onClose={handleCloseFaultProofNotice}>
            <P size='s'>
              <Strong size='inherit'>NOTICE: Fault Proofs are coming to BOB.</Strong> Withdrawals starting on July 4
              will need to be proven again after July 10, requiring at least 7 days to be finalised. Consider waiting
              until the upgrade is complete or using 3rd Party bridge for withdrawals during this period.{' '}
              <Link external icon href={`${DocsLinks.OP_STACK}#settlement--fraud-proofs`} size='inherit'>
                Click here for more info.
              </Link>
            </P>
          </Alert>
        )} */}
        <StyledFlex alignItems='flex-start' direction={{ base: 'column', md: 'row' }} gap='2xl' marginTop='xl'>
          <StyledCard>
            <Tabs fullWidth selectedKey={type} size='lg' onSelectionChange={handleChangeTab}>
              <TabsItem key='deposit' title='Deposit'>
                <></>
              </TabsItem>
              <TabsItem key='withdraw' title='Withdraw'>
                <></>
              </TabsItem>
            </Tabs>
            <BridgeForm
              bridgeOrigin={bridgeOrigin}
              chain={chain}
              ticker={location.state?.ticker}
              type={type}
              onChangeChain={handleChangeChain}
              onChangeNetwork={handleChangeNetwork}
              onChangeOrigin={handleChangeOrigin}
            />
          </StyledCard>
          <TransactionList />
        </StyledFlex>
      </Main>
    </>
  );
};

export { Bridge, BridgeOrigin };
