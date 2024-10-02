import { Flex, P } from '@gobob/ui';

import { Banner } from './Banner';
import { StyledEcosystemImg } from './BannerCarousel.style';
import { BannerTitle } from './BannerTitle';

type EcosystemBannerProps = {
  onPress?: () => void;
};

const EcosystemBanner = ({ onPress }: EcosystemBannerProps) => (
  <Banner isPressable direction='column' onPress={onPress}>
    <Flex alignItems='center'>
      <BannerTitle>BOB Ecosystem</BannerTitle>
    </Flex>
    <P color='grey-50'>Discover the most exciting projects on BOB.</P>
    <StyledEcosystemImg />
  </Banner>
);

export { EcosystemBanner };
