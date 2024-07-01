'use client';

import { ArrowTopRightOnSquare, Flex, H1, P, Tabs, TabsItem, XMark } from '@gobob/ui';
import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { ChainId, getChainIdByChainName, getChainName } from '@gobob/chains';
import { useLocalStorage } from '@uidotdev/usehooks';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { Main } from '../../components';
import { L1_CHAIN, L2_CHAIN, LocalStorageKey, RoutesPath } from '../../constants';
import { FeatureFlags, useFeatureFlag } from '../../hooks';

import { StyledBanner, StyledBannerCloseBtn, StyledBannerContent, StyledCard, StyledFlex } from './Bridge.style';
import { BannerCarousel, BridgeForm, TransactionList } from './components';

enum BridgeOrigin {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL'
}

const Bridge = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

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

  const [isEcosystemBannerHidden, setEcosystemBannerVisibility] = useLocalStorage(
    LocalStorageKey.HIDE_ECOSYSTEM_BANNER
  );
  const isBtcOnRampEnabled = useFeatureFlag(FeatureFlags.BTC_ONRAMP);

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

  const handlePressEcosystemBanner = useCallback(
    // TODO: scroll to element
    () => router.push(RoutesPath.FUSION),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handlePressOnrampBanner = useCallback(() => {
    setChain('BTC');
    setBridgeOrigin(BridgeOrigin.INTERNAL);
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    searchParams.set('type', type);

    router.replace(`${pathname}?${searchParams.toString()}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const network = chain === 'BTC' ? 'bitcoin' : getChainName(chain);

    searchParams.set('network', network);

    router.replace(`${pathname}?${searchParams.toString()}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain]);

  const ticker = useMemo(() => searchParams.get('ticker') ?? undefined, []);

  return (
    <Main maxWidth='5xl' padding='md'>
      {isBtcOnRampEnabled ? (
        <BannerCarousel
          onPressEcosystemBanner={handlePressEcosystemBanner}
          onPressOnrampBanner={handlePressOnrampBanner}
        />
      ) : (
        !isEcosystemBannerHidden && (
          <StyledBanner
            isHoverable
            isPressable
            aria-label='navigate to ecosystem section in fusion page'
            paddingX='2xl'
            paddingY='4xl'
            onPress={handlePressEcosystemBanner}
          >
            <StyledBannerCloseBtn
              isIconOnly
              aria-label='close banner'
              size='s'
              variant='ghost'
              onPress={() => setEcosystemBannerVisibility(true)}
            >
              <XMark />
            </StyledBannerCloseBtn>
            <StyledBannerContent direction='column'>
              <Flex alignItems='center'>
                <H1 size='2xl' weight='bold'>
                  BOB Ecosystem <ArrowTopRightOnSquare size='s' />
                </H1>
              </Flex>
              <P>Discover the most exciting projects on BOB.</P>
            </StyledBannerContent>
            {/* <StyledBannerImg alt='BOB ecosystem banner' src={bannerSrc} /> */}
          </StyledBanner>
        )
      )}
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
  );
};

export { Bridge, BridgeOrigin };
