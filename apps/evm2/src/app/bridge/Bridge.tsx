'use client';

import { ChainId, getChainIdByChainName, getChainName } from '@gobob/chains';
import { Tabs, TabsItem } from '@gobob/ui';
import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useSessionStorage } from '@uidotdev/usehooks';

import { BannerCarousel, BridgeForm, TransactionList } from './components';
import { StyledCard, StyledFlex } from './Bridge.style';

import { Main } from '@/components';
import { L1_CHAIN, L2_CHAIN } from '@/constants';
import { SessionStorageKey } from '@/types/session-storage';

enum BridgeOrigin {
  Internal = 'INTERNAL',
  External = 'EXTERNAL'
}

enum Type {
  Deposit = 'deposit',
  Withdraw = 'withdraw'
}

const Bridge = () => {
  const location = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [type, setType] = useState((searchParams?.get('type') as Type) || Type.Deposit);
  const [bridgeOrigin, setBridgeOrigin] = useState<BridgeOrigin>(BridgeOrigin.Internal);

  const initialChain = useMemo(() => {
    const network = searchParams?.get('network');

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

  // const [isFaultProofNoticeHidden, setFaultProofNoticeHidden] = useLocalStorage(
  //   LocalStorageKey.HIDE_FAULT_PROOFS_NOTICE
  // );

  const handleChangeTab = useCallback((key: Key) => {
    setType(key as Type);
    setBridgeOrigin((key as Type) === Type.Deposit ? BridgeOrigin.Internal : BridgeOrigin.External);
    setChain(L1_CHAIN);
  }, []);

  const handleChangeNetwork = useCallback(
    (network: Key) => {
      if (network === 'BTC') {
        return setBridgeOrigin(BridgeOrigin.Internal);
      }

      if (type === Type.Deposit ? network !== L1_CHAIN : network !== L2_CHAIN) {
        setBridgeOrigin(BridgeOrigin.External);
      } else {
        setBridgeOrigin(BridgeOrigin.Internal);
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
    const network = chain === 'BTC' ? 'bitcoin' : getChainName(chain);

    if (searchParams) {
      const urlSearchParams = new URLSearchParams(searchParams);

      urlSearchParams.set('type', type);
      urlSearchParams.set('network', network);

      if (chain !== 'BTC') {
        urlSearchParams.delete('receive');
      }

      router.replace('?' + urlSearchParams);
    }
  }, [type, chain, searchParams, router]);

  const [bridgeToBtc, setBridgeToBtc] = useSessionStorage(SessionStorageKey.BRIDGE_TO_BTC, false);
  const [ticker] = useSessionStorage(SessionStorageKey.TICKER, undefined);

  useEffect(() => {
    if (bridgeToBtc) {
      setBridgeToBtc(false);
      setChain('BTC');
      setBridgeOrigin(BridgeOrigin.Internal);
    }
  }, [bridgeToBtc, location, setBridgeToBtc]);

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
              <TabsItem key={Type.Deposit} title='Deposit'>
                <></>
              </TabsItem>
              <TabsItem key={Type.Withdraw} title='Withdraw'>
                <></>
              </TabsItem>
            </Tabs>
            <BridgeForm
              bridgeOrigin={bridgeOrigin}
              chain={chain}
              ticker={ticker}
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

export { Bridge, BridgeOrigin, Type };
