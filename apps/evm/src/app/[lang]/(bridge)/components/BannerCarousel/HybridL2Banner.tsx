import { Flex, P } from '@gobob/ui';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { Banner } from './Banner';
import { StyledBannerContent, StyledHybridL2Img } from './BannerCarousel.style';
import { BannerTitle } from './BannerTitle';

type HybridL2BannerProps = {
  onPress?: () => void;
};

const HybridL2Banner = ({ onPress }: HybridL2BannerProps) => {
  const { i18n } = useLingui();

  return (
    <Banner isPressable direction='column' justifyContent='center' onPress={onPress}>
      <StyledBannerContent direction='column'>
        <Flex alignItems='center'>
          <BannerTitle>
            <Trans>Released: BOB&apos;s Hybrid L2 vision paper</Trans>
          </BannerTitle>
        </Flex>
        <P color='grey-50'>
          <Trans>Read it now.</Trans>
        </P>
      </StyledBannerContent>
      <StyledHybridL2Img alt={t(i18n)`Hybrid L2`} height='144' src='/assets/hybrid-l2-banner.png' width='336' />
    </Banner>
  );
};

export { HybridL2Banner };
