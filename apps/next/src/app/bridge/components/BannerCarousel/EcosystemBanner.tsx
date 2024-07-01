import { Flex, H1, P } from '@gobob/ui';

import { StyledBannerImg } from './BannerCarousel.style';
import { Banner } from './Banner';

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
    <P color='grey-200'>Discover the most exciting projects on BOB.</P>
    <StyledBannerImg
      height={800}
      src='/ecosystem-banner.png'
      alt='BOB ecosystem banner'
      // sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      width={800}
    />
  </Banner>
);

export { EcosystemBanner };
