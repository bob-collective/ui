import { Flex, P } from '@gobob/ui';

import { Banner } from './Banner';
import { StyledIntractImg } from './BannerCarousel.style';
import { BannerTitle } from './BannerTitle';

type IntractBannerProps = {
  onPress?: () => void;
};

const IntractBanner = ({ onPress }: IntractBannerProps) => (
  <Banner isPressable gap='md' justifyContent='space-between' onPress={onPress}>
    <Flex direction='column'>
      <Flex alignItems='center'>
        <BannerTitle>Stablecoin Carnival with BOB</BannerTitle>
      </Flex>
      <P color='grey-50'>Particpate & get extra SPICE!</P>
    </Flex>
    <StyledIntractImg />
  </Banner>
);

export { IntractBanner };
