import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { EcosystemBanner } from './EcosystemBanner';
import { StyledCard, StyledSlider } from './BannerCarousel.style';

const BannerCarousel = () => {
  const settings = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 500,
    autoplaySpeed: 10000,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true
  };

  return (
    <StyledCard aria-label='navigate to ecosystem section in fusion page' paddingX='none' paddingY='none'>
      <StyledSlider {...settings}>
        <EcosystemBanner />
        <EcosystemBanner />
      </StyledSlider>
    </StyledCard>
  );
};

export { BannerCarousel };
