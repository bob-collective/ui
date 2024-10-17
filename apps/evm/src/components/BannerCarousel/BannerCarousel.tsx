'use client';

import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { Settings } from 'react-slick';
import { ChevronLeft, ChevronRight, useMediaQuery } from '@gobob/ui';
import { useTheme } from 'styled-components';
import { HTMLAttributes, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSessionStorage, useIsClient } from 'usehooks-ts';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { BinanceCampaignBanner } from './BinanceCampaignBanner';
import { StyledCarouselWrapper, StyledSlider } from './BannerCarousel.style';
import { OnrampBanner } from './OnrampBanner';
import { FusionBanner } from './FusionBanner';
import { XBanner } from './XBanner';

import { FeatureFlags, useFeatureFlag } from '@/hooks';
import { RoutesPath } from '@/constants';
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
  autoplay: true,
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
  const { i18n } = useLingui();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('s'));
  const router = useRouter();
  const params = useParams();
  const isClient = useIsClient();

  const isBtcGatewayEnabled = useFeatureFlag(FeatureFlags.BTC_GATEWAY);
  const setBridgeToBtc = useSessionStorage(SessionStorageKey.BRIDGE_TO_BTC, false, {
    initializeWithValue: isClient
  })[1];

  const onPressOnrampBanner = useCallback(
    () => {
      setBridgeToBtc(true);
      router.push(`/${params.lang}${RoutesPath.BRIDGE}`);
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

  const onPressBinanceCampaignBanner = useCallback(
    () => window.open('https://www.binance.com/en/activity/mission/bob-campaign', '_blank', 'noreferrer'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <StyledCarouselWrapper
      aria-label={t(i18n)`navigate to ecosystem section in fusion page`}
      paddingX='none'
      paddingY='none'
    >
      <StyledSlider {...settings} arrows={isDesktop && isClient}>
        <XBanner onPress={onPressXBanner} />
        <BinanceCampaignBanner onPress={onPressBinanceCampaignBanner} />
        <FusionBanner onPress={onPressFusionBanner} />
        {isBtcGatewayEnabled && <OnrampBanner onPress={onPressOnrampBanner} />}
      </StyledSlider>
    </StyledCarouselWrapper>
  );
};

export { BannerCarousel };
