import { Flex, H1, P } from '@gobob/ui';

import bannerSrc from '../../../../assets/intract-logo.png';

import { StyledIntractBannerImg } from './BannerCarousel.style';
import { Banner } from './Banner';

const IntractBanner = () => (
  <Banner
    isPressable
    gap='md'
    justifyContent='space-between'
    onPress={() =>
      (window.location.href =
        'https://www.intract.io/explore?query=BOB+Summer+Fest&sortBy=launchDate&entity_type=CAMPAIGN&chainId=60808&hideExpired=true')
    }
  >
    <Flex direction='column'>
      <Flex alignItems='center'>
        <H1 size='2xl' weight='bold'>
          Intract: BOB Summer Fest
        </H1>
      </Flex>
      <P color='grey-50'>Complete quests to boost your Spice earnings</P>
    </Flex>
    <StyledIntractBannerImg alt='Intract Logo' src={bannerSrc} />
  </Banner>
);

export { IntractBanner };
