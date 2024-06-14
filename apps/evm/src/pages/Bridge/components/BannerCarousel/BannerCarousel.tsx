import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { Settings } from 'react-slick';
import { ChevronLeft, ChevronRight, useMediaQuery } from '@gobob/ui';
import { useTheme } from 'styled-components';

import { EcosystemBanner } from './EcosystemBanner';
import { StyledCard, StyledSlider } from './BannerCarousel.style';
import { OnrampBanner } from './OnrampBanner';

const BannerCarousel = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('s'));

  const settings: Settings = {
    dots: true,
    fade: true,
    infinite: true,
    arrows: isDesktop,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 10000,
    cssEase: 'linear',
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    nextArrow: (
      <button>
        <ChevronRight size='lg' strokeWidth='3' />
      </button>
    ),
    prevArrow: (
      <button>
        <ChevronLeft strokeWidth='3' />
      </button>
    )
  };

  return (
    <StyledCard aria-label='navigate to ecosystem section in fusion page' paddingX='none' paddingY='none'>
      <StyledSlider {...settings}>
        <OnrampBanner />
        <EcosystemBanner />
      </StyledSlider>
    </StyledCard>
  );
};

export { BannerCarousel };
