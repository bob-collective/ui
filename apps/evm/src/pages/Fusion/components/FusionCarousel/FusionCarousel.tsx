import { StyledCarouselWrapper } from './FusionCarousel.style';
import { IntractBanner } from './IntractBanner';

const FusionCarousel = () => {
  return (
    <StyledCarouselWrapper aria-label='navigate to Intract website' paddingX='none' paddingY='none'>
      <IntractBanner />
    </StyledCarouselWrapper>
  );
};

export { FusionCarousel };
