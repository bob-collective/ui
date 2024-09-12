import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { Settings } from 'react-slick';
import { ChevronLeft, ChevronRight, useMediaQuery } from '@gobob/ui';
import { useTheme } from 'styled-components';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { RoutesPath } from '../../constants';
import { FeatureFlags, useFeatureFlag } from '../../hooks';

import { EcosystemBanner } from './EcosystemBanner';
import { StyledCarouselWrapper, StyledSlider } from './BannerCarousel.style';
import { OnrampBanner } from './OnrampBanner';
import { BitgetCampaignBanner } from './BitgetCampaignBanner';
import { FusionBanner } from './FusionBanner';

function NextArrow(props: any) {
  const { className, style, onClick } = props;

  return (
    <button className={className} style={style} onClick={onClick}>
      <ChevronRight strokeWidth='3' />
    </button>
  );
}

function PrevArrow(props: any) {
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
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('s'));
  const navigate = useNavigate();

  const isBtcOnRampEnabled = useFeatureFlag(FeatureFlags.BTC_ONRAMP);

  const onPressEcosystemBanner = useCallback(
    () => navigate(RoutesPath.FUSION, { state: { scrollEcosystem: true } }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onPressOnrampBanner = useCallback(
    () => navigate(RoutesPath.BRIDGE, { state: { setBridgeToBtc: true } }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onPressBitgetCampaignBanner = useCallback(
    () => window.open('https://bitgetwallet.onelink.me/6Vx1/8xbtum2q', '_blank', 'noreferrer'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onPressFusionBanner = useCallback(
    () => window.open('https://discord.com/channels/1214916952288403476/1229368391148634143', '_blank', 'noreferrer'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <StyledCarouselWrapper aria-label='navigate to ecosystem section in fusion page' paddingX='none' paddingY='none'>
      <StyledSlider {...settings} arrows={isDesktop}>
        <FusionBanner onPress={onPressFusionBanner} />
        <BitgetCampaignBanner onPress={onPressBitgetCampaignBanner} />
        <EcosystemBanner onPress={onPressEcosystemBanner} />
        {isBtcOnRampEnabled && <OnrampBanner onPress={onPressOnrampBanner} />}
      </StyledSlider>
    </StyledCarouselWrapper>
  );
};

export { BannerCarousel };
