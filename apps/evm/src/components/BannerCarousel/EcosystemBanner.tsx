import { Flex, H1, P } from '@gobob/ui';

import { Banner } from './Banner';
import { StyledEcosystemImg } from './BannerCarousel.style';

type EcosystemBannerProps = {
  onPress?: () => void;
};

const EcosystemBanner = ({ onPress }: EcosystemBannerProps) => (
  <Banner isPressable direction='column' onPress={onPress}>
    <Flex alignItems='center'>
      <H1 size='2xl' weight='bold'>
        BOB Ecosystem
      </H1>
    </Flex>
    <P color='grey-50'>Discover the most exciting projects on BOB.</P>
    <StyledEcosystemImg />
  </Banner>
);

export { EcosystemBanner };
