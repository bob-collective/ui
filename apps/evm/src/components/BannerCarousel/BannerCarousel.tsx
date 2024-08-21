import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { Settings } from 'react-slick';
import { ChevronLeft, ChevronRight, useMediaQuery } from '@gobob/ui';
import { useTheme } from 'styled-components';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { RoutesPath } from '../../constants';

import { EcosystemBanner } from './EcosystemBanner';
import { StyledCarouselWrapper, StyledSlider } from './BannerCarousel.style';
import { IntractBanner } from './IntractBanner';
import { OnrampBanner } from './OnrampBanner';

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
  initialSlide: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />
};

const BannerCarousel = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('s'));
  const navigate = useNavigate();

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

  return (
    <StyledCarouselWrapper aria-label='navigate to ecosystem section in fusion page' paddingX='none' paddingY='none'>
      <StyledSlider {...settings} arrows={isDesktop}>
        <IntractBanner />
        <EcosystemBanner onPress={onPressEcosystemBanner} />
        <OnrampBanner onPress={onPressOnrampBanner} />
      </StyledSlider>
    </StyledCarouselWrapper>
  );
};

export { BannerCarousel };
