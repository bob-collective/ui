import { Flex, P } from '@gobob/ui';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { Banner } from './Banner';
import { StyledBannerContent, StyledFusionImg } from './BannerCarousel.style';
import { BannerTitle } from './BannerTitle';

type FusionBannerProps = {
  onPress?: () => void;
};

const FusionBanner = ({ onPress }: FusionBannerProps) => {
  const { i18n } = useLingui();

  return (
    <Banner isPressable direction='column' justifyContent='center' onPress={onPress}>
      <StyledBannerContent direction='column'>
        <Flex alignItems='center'>
          <BannerTitle>
            <Trans>BOB Fusion: The Final Season</Trans>
          </BannerTitle>
        </Flex>
        <P color='grey-50'>
          <Trans>Read the official Fusion Guide on the new BOB Blog and start harvesting Spice now.</Trans>
        </P>
      </StyledBannerContent>
      <StyledFusionImg
        alt={t(i18n)`Fusion season three`}
        height='144'
        src='/assets/fusion-season-three.png'
        width='336'
      />
    </Banner>
  );
};

export { FusionBanner };
