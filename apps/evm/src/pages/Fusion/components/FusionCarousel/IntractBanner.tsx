import { Flex, H1, P } from '@gobob/ui';

import bannerSrc from '../../../../assets/intract-logo.png';

import { StyledBannerContent, StyledBannerImg, StyledCarouselBanner } from './FusionCarousel.style';

const IntractBanner = () => (
  <StyledCarouselBanner
    isPressable
    gap='md'
    justifyContent='space-between'
    onPress={() =>
      (window.location.href =
        'https://www.intract.io/explore?query=BOB+Summer+Fest&hideCompleted=true&hideExpired=true&sortBy=participation')
    }
  >
    <StyledBannerContent direction='column'>
      <Flex alignItems='center'>
        <H1 size='2xl' weight='bold'>
          Intract: BOB Summer Fest
        </H1>
      </Flex>
      <P color='grey-200'>Complete quests to boost your Spice earnings</P>
    </StyledBannerContent>
    <StyledBannerImg alt='Intract Logo' src={bannerSrc} />
  </StyledCarouselBanner>
);

export { IntractBanner };
