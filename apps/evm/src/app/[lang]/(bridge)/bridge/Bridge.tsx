'use client';

import { ChainId, getChainIdByChainName, getChainName } from '@gobob/chains';
import { Tabs, TabsItem } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { usePathname, useRouter } from 'next/navigation';
import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';

import { Layout, TransactionList } from '../components';

import { StyledCard, StyledFlex } from './Bridge.style';
import { BridgeForm } from './components';
import { useGetTransactions } from './hooks';

import { isClient, L1_CHAIN, L2_CHAIN } from '@/constants';
import { TransactionDirection } from '@/types';
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
  const {
    data: transactions,
    isInitialLoading: isTransactionsInitialLoading,
    refetch,
    txPendingUserAction
  } = useGetTransactions();

  const location = usePathname();
  const router = useRouter();

  const urlSearchParams = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const type = (urlSearchParams.get('type') as Type) || Type.Deposit;
  const direction = type === Type.Deposit ? TransactionDirection.L1_TO_L2 : TransactionDirection.L2_TO_L1;

  const [bridgeOrigin, setBridgeOrigin] = useState<BridgeOrigin>(
    type === Type.Deposit ? BridgeOrigin.Internal : BridgeOrigin.External
  );

  const initialChain = useMemo(() => {
    const network = urlSearchParams.get('network');

    if (!network || network === 'bitcoin') {
      return 'BTC';
    }

    return getChainIdByChainName(network) || L1_CHAIN;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [chain, setChain] = useState<ChainId | 'BTC'>(initialChain);

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
    <Layout>
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
            direction={direction}
            ticker={ticker}
            onChangeChain={handleChangeChain}
            onChangeNetwork={handleChangeNetwork}
            onChangeOrigin={handleChangeOrigin}
          />
        </StyledCard>
        <TransactionList
          data={transactions}
          isInitialLoading={isTransactionsInitialLoading}
          txPendingUserAction={txPendingUserAction}
          onProveSuccess={refetch.bridge}
          onRelaySuccess={refetch.bridge}
        />
      </StyledFlex>
    </Layout>
  );
};

export { Bridge, BridgeOrigin };
