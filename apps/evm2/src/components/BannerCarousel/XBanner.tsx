import { Flex, P } from '@gobob/ui';

import { Banner } from './Banner';
import { StyledBannerContent, StyledXImg } from './BannerCarousel.style';
import { BannerTitle } from './BannerTitle';

type XBannerProps = {
  onPress?: () => void;
};

const XBanner = ({ onPress }: XBannerProps) => (
  <Banner isPressable direction='column' justifyContent='center' onPress={onPress}>
    <StyledBannerContent direction='column'>
      <Flex alignItems='center'>
        <BannerTitle>Follow us on X</BannerTitle>
      </Flex>
      <P color='grey-50'>Go follow @build_on_bob</P>
    </StyledBannerContent>
    <StyledXImg alt='x' height='123' src='/assets/x.png' width='336' />
  </Banner>
);

export { XBanner };
