'use client';

import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { Settings } from 'react-slick';
import { ChevronLeft, ChevronRight, useMediaQuery } from '@gobob/ui';
import { useTheme } from 'styled-components';
import { HTMLAttributes, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStorage } from 'usehooks-ts';

import { EcosystemBanner } from './EcosystemBanner';
import { StyledCarouselWrapper, StyledSlider } from './BannerCarousel.style';
import { OnrampBanner } from './OnrampBanner';
import { FusionBanner } from './FusionBanner';
import { XBanner } from './XBanner';

import { FeatureFlags, useFeatureFlag } from '@/hooks';
import { isClient, RoutesPath } from '@/constants';
import { SessionStorageKey } from '@/types';

function NextArrow(props: Pick<HTMLAttributes<HTMLButtonElement>, 'className' | 'style' | 'onClick'>) {
  const { className, style, onClick } = props;

  return (
    <button className={className} style={style} onClick={onClick}>
      <ChevronRight strokeWidth='3' />
    </button>
  );
}

function PrevArrow(props: Pick<HTMLAttributes<HTMLButtonElement>, 'className' | 'style' | 'onClick'>) {
  const { className, style, onClick } = props;

  return (
    <button className={className} style={style} onClick={onClick}>
      <ChevronLeft strokeWidth='3' />
    </button>
  );
}

const settings: Settings = {
  dots: true,
  infinite: true,
  autoplay: false,
  speed: 500,
  autoplaySpeed: 10000,
  cssEase: 'linear',
  slidesToShow: 1,
  slidesToScroll: 1,
  pauseOnHover: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />
};

const BannerCarousel = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('s'));
  const router = useRouter();

  const isBtcGatewayEnabled = useFeatureFlag(FeatureFlags.BTC_GATEWAY);
  const setScrollEcosystem = useSessionStorage(SessionStorageKey.SCROLL_ECOSYSTEM, false, {
    initializeWithValue: isClient
  })[1];
  const setBridgeToBtc = useSessionStorage(SessionStorageKey.BRIDGE_TO_BTC, false, {
    initializeWithValue: isClient
  })[1];

  const onPressEcosystemBanner = useCallback(
    () => {
      setScrollEcosystem(true);
      router.push(RoutesPath.FUSION);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onPressOnrampBanner = useCallback(
    () => {
      setBridgeToBtc(true);
      router.push(RoutesPath.BRIDGE);
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

  return (
    <StyledCarouselWrapper aria-label='navigate to ecosystem section in fusion page' paddingX='none' paddingY='none'>
      <StyledSlider {...settings} arrows={isDesktop}>
        <FusionBanner onPress={onPressFusionBanner} />
        <EcosystemBanner onPress={onPressEcosystemBanner} />
        {isBtcGatewayEnabled && <OnrampBanner onPress={onPressOnrampBanner} />}
        <XBanner onPress={onPressXBanner} />
      </StyledSlider>
    </StyledCarouselWrapper>
  );
};

export { BannerCarousel };
