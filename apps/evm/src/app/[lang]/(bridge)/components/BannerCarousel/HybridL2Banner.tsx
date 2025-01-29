import { Flex, P } from '@gobob/ui';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import hybridL2Banner from '@public/assets/hybrid-l2-banner.png';

import { Banner } from './Banner';
import { StyledBannerContent, StyledImg } from './BannerCarousel.style';
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
        <P color='grey-50' rows={2}>
          <Trans>Read it now.</Trans>
        </P>
      </StyledBannerContent>
      <StyledImg alt={t(i18n)`Hybrid L2`} height='134' placeholder='blur' src={hybridL2Banner} width='311' />
    </Banner>
  );
};

export { HybridL2Banner };
