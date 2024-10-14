'use client';

import { ChainId, getChainIdByChainName, getChainName } from '@gobob/chains';
import { Tabs, TabsItem } from '@gobob/ui';
import { usePathname, useRouter } from 'next/navigation';
import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import { Trans } from '@lingui/macro';

import { StyledCard, StyledFlex } from './Bridge.style';
import { BannerCarousel, BridgeForm, TransactionList } from './components';

import { Main } from '@/components';
import { isClient, L1_CHAIN, L2_CHAIN } from '@/constants';
import { SessionStorageKey } from '@/types/session-storage';

enum BridgeOrigin {
  Internal = 'INTERNAL',
  External = 'EXTERNAL'
}

enum Type {
  Deposit = 'deposit',
  Withdraw = 'withdraw'
}

interface Props {
  searchParams?: { type: Type; network: string };
}

const Bridge = ({ searchParams }: Props) => {
  const location = usePathname();
  const router = useRouter();

  const urlSearchParams = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const type = (urlSearchParams.get('type') as Type) || Type.Deposit;
  const [bridgeOrigin, setBridgeOrigin] = useState<BridgeOrigin>(
    type === Type.Deposit ? BridgeOrigin.Internal : BridgeOrigin.External
  );

  const initialChain = useMemo(() => {
    const network = urlSearchParams.get('network');

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

  const handleChangeTab = useCallback(
    (key: Key) => {
      setBridgeOrigin((key as Type) === Type.Deposit ? BridgeOrigin.Internal : BridgeOrigin.External);
      setChain(L1_CHAIN);
      urlSearchParams.set('type', key as string);
      router.replace('?' + urlSearchParams);
    },
    [router, urlSearchParams]
  );

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

  useEffect(() => {
    const network = chain === 'BTC' ? 'bitcoin' : getChainName(chain);

    urlSearchParams.set('type', type);
    urlSearchParams.set('network', network);

    if (chain !== 'BTC') {
      urlSearchParams.delete('receive');
    }

    router.replace('?' + urlSearchParams);
  }, [type, chain, urlSearchParams, router]);

  const [bridgeToBtc, setBridgeToBtc] = useSessionStorage(SessionStorageKey.BRIDGE_TO_BTC, false, {
    initializeWithValue: isClient
  });
  const [ticker] = useSessionStorage(SessionStorageKey.TICKER, undefined, {
    initializeWithValue: isClient
  });

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
        <StyledFlex alignItems='flex-start' direction={{ base: 'column', md: 'row' }} gap='2xl' marginTop='xl'>
          <StyledCard>
            <Tabs fullWidth selectedKey={type} size='lg' onSelectionChange={handleChangeTab}>
              <TabsItem key={Type.Deposit} title={<Trans>Deposit</Trans>}>
                <></>
              </TabsItem>
              <TabsItem key={Type.Withdraw} title={<Trans>Withdraw</Trans>}>
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
