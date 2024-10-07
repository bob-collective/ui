import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { Settings } from 'react-slick';
import { ChevronLeft, ChevronRight, useMediaQuery } from '@gobob/ui';
import { useTheme } from 'styled-components';
import { useCallback } from 'react';

import { StyledCarouselWrapper, StyledSlider } from './BannerCarousel.style';
import { FusionBanner } from './FusionBanner';
import { XBanner } from './XBanner';

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
        <XBanner onPress={onPressXBanner} />
        <FusionBanner onPress={onPressFusionBanner} />
      </StyledSlider>
    </StyledCarouselWrapper>
  );
};

export { BannerCarousel };
