import { Flex, H1, P } from '@gobob/ui';

import bannerSrc from '../../../../assets/shark-tank-logo.png';

import { StyledBannerContent, StyledBannerImg, StyledCarouselBanner } from './FusionCarousel.style';

const SharkTankBanner = () => (
  <StyledCarouselBanner
    isPressable
    gap='md'
    justifyContent='space-between'
    onPress={() => (window.location.href = 'https://lu.ma/8suv3g52')}
  >
    <StyledBannerContent direction='column'>
      <Flex alignItems='center'>
        <H1 size='2xl' weight='bold'>
          Bitcoin Shark Tank
        </H1>
      </Flex>
      <P color='grey-50'>Pitch your idea to investors during ETHCC</P>
    </StyledBannerContent>
    <StyledBannerImg alt='Bitcoin Shark Tank Logo' src={bannerSrc} />
  </StyledCarouselBanner>
);

export { SharkTankBanner };
