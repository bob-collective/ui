import { Flex, P } from '@gobob/ui';

import { Banner } from './Banner';
import { StyledBannerContent, StyledFusionImg } from './BannerCarousel.style';
import { BannerTitle } from './BannerTitle';

type FusionBannerProps = {
  onPress?: () => void;
};

const FusionBanner = ({ onPress }: FusionBannerProps) => (
  <Banner isPressable direction='column' justifyContent='center' onPress={onPress}>
    <StyledBannerContent direction='column'>
      <Flex alignItems='center'>
        <BannerTitle>BOB Fusion: The Final Season</BannerTitle>
      </Flex>
      <P color='grey-50'>Read the official Fusion Guide on the new BOB Blog and start harvesting Spice now.</P>
    </StyledBannerContent>
    <StyledFusionImg alt='Fusion season three' height='144' src='/assets/fusion-season-three.png' width='336' />
  </Banner>
);

export { FusionBanner };
