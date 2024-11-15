'use client';

import { useMediaQuery } from '@gobob/ui';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import 'react-multi-carousel/lib/styles.css';
import { useTheme } from 'styled-components';
import { useIsClient, useSessionStorage } from 'usehooks-ts';

import { StyledCarousel, StyledCarouselWrapper } from './BannerCarousel.style';
import { FusionBanner } from './FusionBanner';
import { OnrampBanner } from './OnrampBanner';
import { XBanner } from './XBanner';
import { HybridL2Banner } from './HybridL2Banner';
import { OKXCryptopediaBanner } from './OKXCryptopediaBanner';

import { RoutesPath } from '@/constants';
import { SessionStorageKey } from '@/types';

const BannerCarousel = () => {
  const { i18n } = useLingui();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('s'));
  const router = useRouter();
  const params = useParams();
  const isClient = useIsClient();

  const [, setBridgeToBtc] = useSessionStorage(SessionStorageKey.BRIDGE_TO_BTC, false, {
    initializeWithValue: isClient
  });

  const responsive = useMemo(
    () => ({
      desktop: {
        breakpoint: { max: 3000, min: theme.breakpoints.values.md },
        items: 1,
        slidesToSlide: 1
      },
      tablet: {
        breakpoint: { max: theme.breakpoints.values.md, min: theme.breakpoints.values.s },
        items: 1,
        slidesToSlide: 1
      },
      mobile: {
        breakpoint: { max: theme.breakpoints.values.s, min: 0 },
        items: 1,
        slidesToSlide: 1
      }
    }),
    [theme.breakpoints]
  );

  const onPressOnrampBanner = useCallback(
    () => {
      setBridgeToBtc(true);
      router.push(`/${params?.lang}${RoutesPath.BRIDGE}`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onPressFusionBanner = useCallback(
    () => window.open('https://blog.gobob.xyz/posts/bob-fusion-the-final-season', '_blank', 'noreferrer'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onPressXBanner = useCallback(
    () => window.open('https://x.com/build_on_bob', '_blank', 'noreferrer'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onPressHybridL2Banner = useCallback(
    () => window.open('https://blog.gobob.xyz/posts/the-hybrid-l2-paper', '_blank', 'noreferrer'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onPressOKXCryptopediaBanner = useCallback(
    () => window.open('https://www.okx.com/web3/discover/cryptopedia/event/bob', '_blank', 'noreferrer'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <StyledCarouselWrapper
      aria-label={t(i18n)`navigate to ecosystem section in fusion page`}
      paddingX='none'
      paddingY='none'
    >
      <StyledCarousel
        autoPlay
        infinite
        showDots
        ssr
        arrows={isDesktop}
        autoPlaySpeed={10000}
        draggable={false}
        responsive={responsive}
        swipeable={false}
        transitionDuration={500}
      >
        <OKXCryptopediaBanner onPress={onPressOKXCryptopediaBanner} />
        <HybridL2Banner onPress={onPressHybridL2Banner} />
        <XBanner onPress={onPressXBanner} />
        <FusionBanner onPress={onPressFusionBanner} />
        <OnrampBanner onPress={onPressOnrampBanner} />
      </StyledCarousel>
    </StyledCarouselWrapper>
  );
};

export { BannerCarousel };
