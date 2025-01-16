'use client';

import { ChainId, getChainIdByChainName, getChainName } from '@gobob/chains';
import { Tabs, TabsItem } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useRouter } from 'next/navigation';
import { Key, useEffect, useMemo, useState } from 'react';

import { Layout, TransactionList } from '../components';

import { StyledCard, StyledFlex } from './Bridge.style';
import { BridgeForm } from './components';
import { useGetTransactions } from './hooks';

import { L1_CHAIN, L2_CHAIN } from '@/constants';
import { TransactionDirection } from '@/types';

const externalUnsupportedTokens = ['LBTC'];

const getOrigin = (type: Type, chain: ChainId | 'BTC', symbol?: string) => {
  if (chain === 'BTC') {
    return BridgeOrigin.Internal;
  }

  if (symbol && externalUnsupportedTokens.includes(symbol)) {
    return BridgeOrigin.Internal;
  }

  const isDeposit = type === Type.Deposit;

  if ((isDeposit && chain !== L1_CHAIN) || (!isDeposit && chain !== L2_CHAIN)) {
    return BridgeOrigin.External;
  }

  return BridgeOrigin.Internal;
};

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

  const router = useRouter();

  const urlSearchParams = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const type = (urlSearchParams.get('type') as Type) || Type.Deposit;
  const direction = type === Type.Deposit ? TransactionDirection.L1_TO_L2 : TransactionDirection.L2_TO_L1;

  const initialChain = useMemo(() => {
    const network = urlSearchParams.get('network');

    if (!network || network === 'bitcoin') {
      return 'BTC';
    }

    return getChainIdByChainName(network) || L1_CHAIN;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [chain, setChain] = useState<ChainId | 'BTC'>(initialChain);

  const [symbol, setSymbol] = useState<string | undefined>(urlSearchParams?.get('receive')?.toString());

  const [bridgeOrigin, setBridgeOrigin] = useState<BridgeOrigin>(getOrigin(type, chain, symbol));

  const handleChangeTab = (key: Key) => {
    if (type === key.toString()) return;

    const newChain = L1_CHAIN;

    setChain(newChain);
    handleChangeOrigin(getOrigin(key as Type, newChain, symbol));

    urlSearchParams.set('type', key as string);
    router.replace('?' + urlSearchParams);
  };

  const handleChangeOrigin = (origin: BridgeOrigin) => setBridgeOrigin(origin);

  const handleChangeChain = (chain: ChainId | 'BTC') => {
    setChain(chain);
    setSymbol(undefined);
    handleChangeOrigin(getOrigin(type, chain));
  };

  const handleChangeSymbol = (symbol?: string) => {
    setSymbol(symbol);
  };

  useEffect(() => {
    const network = chain === 'BTC' ? 'bitcoin' : getChainName(chain);

    urlSearchParams.set('type', type);
    urlSearchParams.set('network', network);

    if (symbol) {
      urlSearchParams.set('receive', symbol);
    } else {
      urlSearchParams.delete('receive');
    }

    router.replace('?' + urlSearchParams);
  }, [type, chain, router, symbol, urlSearchParams]);

  const isBobBridgeDisabled = !(chain === L1_CHAIN || chain === L2_CHAIN || chain === 'BTC');

  const isExternalBridgeDisabled = chain === 'BTC' || !!(symbol && externalUnsupportedTokens.includes(symbol));

  const isWithdrawTabDisabled = chain === 'BTC';

  const tabsDisabledKeys = isWithdrawTabDisabled ? [Type.Withdraw] : undefined;

  return (
    <Layout>
      <StyledFlex alignItems='flex-start' direction={{ base: 'column', md: 'row' }} gap='2xl' marginTop='xl'>
        <StyledCard>
          <Tabs
            fullWidth
            disabledKeys={tabsDisabledKeys}
            selectedKey={type}
            size='lg'
            onSelectionChange={handleChangeTab}
          >
            <TabsItem key={Type.Deposit} title={<Trans>Deposit</Trans>}>
              <></>
            </TabsItem>
            <TabsItem
              key={Type.Withdraw}
              title={<Trans>Withdraw</Trans>}
              tooltipProps={{
                isDisabled: !isWithdrawTabDisabled,
                label: <Trans>Withdrawals back to BTC are currently not supported</Trans>
              }}
            >
              <></>
            </TabsItem>
          </Tabs>
          <BridgeForm
            bridgeOrigin={bridgeOrigin}
            chain={chain}
            direction={direction}
            isBobBridgeDisabled={isBobBridgeDisabled}
            isExternalBridgeDisabled={isExternalBridgeDisabled}
            symbol={symbol}
            onChangeChain={handleChangeChain}
            onChangeOrigin={handleChangeOrigin}
            onChangeSymbol={handleChangeSymbol}
          />
        </StyledCard>
        <TransactionList
          data={transactions}
          isInitialLoading={isTransactionsInitialLoading}
          txPendingUserAction={txPendingUserAction}
          type='bridge'
          onProveSuccess={refetch.bridge}
          onRelaySuccess={refetch.bridge}
        />
      </StyledFlex>
    </Layout>
  );
};

export { Bridge, BridgeOrigin };
