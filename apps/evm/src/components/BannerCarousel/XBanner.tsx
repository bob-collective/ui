import { Flex, P } from '@gobob/ui';

import xImg from '../../assets/x.png';

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
      <P color='grey-50'>To stay up-to date with the BOB ecosystem follow @build_on_bob.</P>
    </StyledBannerContent>
    <StyledXImg src={xImg} />
  </Banner>
);

export { XBanner };
