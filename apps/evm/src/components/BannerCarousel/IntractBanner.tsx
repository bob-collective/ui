import { Flex, H1, P } from '@gobob/ui';

import { Banner } from './Banner';
import { StyledIntractImg } from './BannerCarousel.style';

const IntractBanner = () => (
  <Banner
    isPressable
    gap='md'
    justifyContent='space-between'
    onPress={() => (window.location.href = 'https://www.intract.io/events/66b9e41cc8ff56cba8440d36')}
  >
    <Flex direction='column'>
      <Flex alignItems='center'>
        <H1 size='2xl' weight='bold'>
          Stablecoin Carnival with BOB
        </H1>
      </Flex>
      <P color='grey-50'>Particpate & get extra SPICE!</P>
    </Flex>
    <StyledIntractImg />
  </Banner>
);

export { IntractBanner };
