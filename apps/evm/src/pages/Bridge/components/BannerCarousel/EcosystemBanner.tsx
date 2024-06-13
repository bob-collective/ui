import { ArrowTopRightOnSquare, Flex, H1, P } from '@gobob/ui';

import bannerSrc from '../../../../assets/ecosystem-banner.png';

import { StyledBannerContent, StyledBannerImg } from './BannerCarousel.style';
import { Banner } from './Banner';

const EcosystemBanner = () => {
  return (
    <Banner>
      <StyledBannerContent direction='column'>
        <Flex alignItems='center'>
          <H1 size='2xl' weight='bold'>
            BOB Ecosystem <ArrowTopRightOnSquare size='s' />
          </H1>
        </Flex>
        <P>Discover the most exciting projects on BOB.</P>
      </StyledBannerContent>
      <StyledBannerImg alt='BOB ecosystem banner' src={bannerSrc} />
    </Banner>
  );
};

export { EcosystemBanner };
