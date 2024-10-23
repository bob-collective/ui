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

import { RoutesPath } from '@/constants';
import { FeatureFlags, useFeatureFlag } from '@/hooks';
import { SessionStorageKey } from '@/types';

const BannerCarousel = () => {
  const { i18n } = useLingui();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('s'));
  const router = useRouter();
  const params = useParams();
  const isClient = useIsClient();

  const isBtcGatewayEnabled = useFeatureFlag(FeatureFlags.BTC_GATEWAY);
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

  // Comment
  const onPressXBanner = useCallback(
    () => window.open('https://x.com/build_on_bob', '_blank', 'noreferrer'),
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
        <XBanner onPress={onPressXBanner} />
        <FusionBanner onPress={onPressFusionBanner} />
        {isBtcGatewayEnabled && <OnrampBanner onPress={onPressOnrampBanner} />}
      </StyledCarousel>
    </StyledCarouselWrapper>
  );
};

export { BannerCarousel };
