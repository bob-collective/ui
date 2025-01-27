import { Flex, P } from '@gobob/ui';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import fusionSeasonThree from '@public/assets/fusion-season-three.png';

import { Banner } from './Banner';
import { StyledBannerContent, StyledImg } from './BannerCarousel.style';
import { BannerTitle } from './BannerTitle';

type FusionBannerProps = {
  onPress?: () => void;
  hasImgOpacity?: boolean;
};

const FusionBanner = ({ onPress, hasImgOpacity }: FusionBannerProps) => {
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
      <StyledImg
        $hasImgOpacity={hasImgOpacity}
        alt={t(i18n)`Fusion season three`}
        height='134'
        placeholder='blur'
        src={fusionSeasonThree}
        width='313'
      />
    </Banner>
  );
};

export { FusionBanner };
