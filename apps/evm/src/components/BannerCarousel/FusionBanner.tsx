import { Flex, P } from '@gobob/ui';

import fusionEndImg from '../../assets/fusion-end.jpg';

import { Banner } from './Banner';
import { StyledFusionImg } from './BannerCarousel.style';
import { BannerTitle } from './BannerTitle';

type FusionBannerProps = {
  onPress?: () => void;
};

const FusionBanner = ({ onPress }: FusionBannerProps) => (
  <Banner isPressable direction='column' onPress={onPress}>
    <Flex alignItems='center'>
      <BannerTitle>BOB Fusion S02 is Ending Soon!</BannerTitle>
    </Flex>
    <P color='grey-50'>Check out the announcement in Discord</P>
    <StyledFusionImg src={fusionEndImg} />
  </Banner>
);

export { FusionBanner };
