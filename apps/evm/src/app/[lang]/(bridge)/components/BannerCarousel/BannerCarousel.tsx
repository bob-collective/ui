'use client';

import { useMediaQuery } from '@gobob/ui';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useCallback, useMemo } from 'react';
import 'react-multi-carousel/lib/styles.css';
import { useTheme } from 'styled-components';
import { useIsClient } from 'usehooks-ts';

import { StyledCarousel, StyledCarouselWrapper } from './BannerCarousel.style';
import { FusionBanner } from './FusionBanner';
import { XBanner } from './XBanner';
import { HybridL2Banner } from './HybridL2Banner';
import { BabylonBanner } from './BabylonBanner';

const BannerCarousel = () => {
  const { i18n } = useLingui();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('s'));
  const isCleint = useIsClient();

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

  const onPressBabylonBanner = useCallback(
    () =>
      window.open(
        'https://blog.gobob.xyz/posts/bob-integrates-with-babylon-to-become-a-bitcoin-secured-network-bringing-bitcoin-finality-to-the-hybrid-l2',
        '_blank',
        'noreferrer'
      ),
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

  return (
    <StyledCarouselWrapper
      aria-label={t(i18n)`navigate to ecosystem section in fusion page`}
      paddingX='none'
      paddingY='none'
    >
      {isCleint ? (
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
          <BabylonBanner onPress={onPressBabylonBanner} />
          <HybridL2Banner onPress={onPressHybridL2Banner} />
          <XBanner onPress={onPressXBanner} />
          <FusionBanner onPress={onPressFusionBanner} />
        </StyledCarousel>
      ) : (
        <BabylonBanner onPress={onPressBabylonBanner} />
      )}
    </StyledCarouselWrapper>
  );
};

export { BannerCarousel };
