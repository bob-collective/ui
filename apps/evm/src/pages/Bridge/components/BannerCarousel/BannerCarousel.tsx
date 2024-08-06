import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { Settings } from 'react-slick';
import { ChevronLeft, ChevronRight, useMediaQuery } from '@gobob/ui';
import { useTheme } from 'styled-components';

import { EcosystemBanner } from './EcosystemBanner';
import { StyledCarouselWrapper, StyledSlider } from './BannerCarousel.style';
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
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />
};

type BannerCarouselProps = {
  onPressOnrampBanner: () => void;
  onPressEcosystemBanner: () => void;
};

const BannerCarousel = ({ onPressOnrampBanner, onPressEcosystemBanner }: BannerCarouselProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('s'));

  return (
    <StyledCarouselWrapper aria-label='navigate to ecosystem section in fusion page' paddingX='none' paddingY='none'>
      <StyledSlider {...settings} arrows={isDesktop}>
        <OnrampBanner onPress={onPressOnrampBanner} />
        <EcosystemBanner onPress={onPressEcosystemBanner} />
      </StyledSlider>
    </StyledCarouselWrapper>
  );
};

export { BannerCarousel };
