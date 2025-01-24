'use client';

import { ChainId, getChainIdByChainName, getChainName } from '@gobob/chains';
import { Flex, Tabs, TabsItem } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useRouter } from 'next/navigation';
import { Key, useCallback, useEffect, useMemo, useState } from 'react';

import { BannerCarousel } from '../components/BannerCarousel';

import { StyledCard } from './Bridge.style';
import { ActivityButton, BridgeForm } from './components';

import { Main } from '@/components';
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
  const router = useRouter();

  const urlSearchParams = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const type = (urlSearchParams.get('type') as Type) || Type.Deposit;
  const direction = type === Type.Deposit ? TransactionDirection.L1_TO_L2 : TransactionDirection.L2_TO_L1;

  const symbol = urlSearchParams?.get('receive')?.toString();

  const getChain = useCallback(() => {
    const network = urlSearchParams.get('network');

    if (!network || network === 'bitcoin') {
      return 'BTC';
    }

    return getChainIdByChainName(network) || L1_CHAIN;
  }, [urlSearchParams]);

  const [chain, setChain] = useState<ChainId | 'BTC'>(getChain());

  const [bridgeOrigin, setBridgeOrigin] = useState<BridgeOrigin>(getOrigin(type, chain, symbol));

  const handleChangeTab = (key: Key) => {
    if (type === key.toString()) return;

    urlSearchParams.set('type', key as string);

    const newChain = L1_CHAIN;

    setChain(newChain);
    handleNetworkChange(chain);
    handleChangeOrigin(getOrigin(key as Type, newChain, symbol));

    router.replace('?' + urlSearchParams);
  };

  const handleChangeOrigin = (origin: BridgeOrigin) => setBridgeOrigin(origin);

  const handleChangeChain = (chain: ChainId | 'BTC') => {
    setChain(chain);
    handleNetworkChange(chain);

    urlSearchParams.delete('receive');

    handleChangeOrigin(getOrigin(type, chain));

    router.replace('?' + urlSearchParams);
  };

  const handleChangeSymbol = (symbol?: string) => {
    if (symbol) {
      urlSearchParams.set('receive', symbol);
    } else {
      urlSearchParams.delete('receive');
    }

    router.replace('?' + urlSearchParams);
  };

  const handleNetworkChange = (chain: ChainId | 'BTC') => {
    const network = chain === 'BTC' ? 'bitcoin' : getChainName(chain);

    urlSearchParams.set('network', network);
  };

  useEffect(() => {
    const chain = getChain();

    setChain(chain);

    handleChangeOrigin(getOrigin(type, chain, symbol));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearchParams]);

  const isBobBridgeDisabled = !(chain === L1_CHAIN || chain === L2_CHAIN || chain === 'BTC');

  const isExternalBridgeDisabled = chain === 'BTC' || !!(symbol && externalUnsupportedTokens.includes(symbol));

  const isWithdrawTabDisabled = chain === 'BTC';

  const tabsDisabledKeys = isWithdrawTabDisabled ? [Type.Withdraw] : undefined;

  return (
    <Main maxWidth='lg' padding='md'>
      <BannerCarousel hasImgOpacity />
      <Flex justifyContent='center' marginTop='2xl' style={{ width: '100%' }}>
        <Flex direction='column' gap='md' style={{ width: '100%' }}>
          <Flex justifyContent='flex-end'>
            <ActivityButton />
          </Flex>
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
        </Flex>
      </Flex>
    </Main>
  );
};

export { Bridge, BridgeOrigin };
