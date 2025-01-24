import { Flex, P } from '@gobob/ui';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import babylon from '@public/assets/babylon.png';

import { Banner } from './Banner';
import { StyledImg, StyledBannerContent } from './BannerCarousel.style';
import { BannerTitle } from './BannerTitle';

type FusionBannerProps = {
  onPress?: () => void;
  hasImgOpacity?: boolean;
};

const BabylonBanner = ({ hasImgOpacity, onPress }: FusionBannerProps) => {
  const { i18n } = useLingui();

  return (
    <Banner isPressable direction='column' justifyContent='center' onPress={onPress}>
      <StyledBannerContent direction='column'>
        <Flex alignItems='center'>
          <BannerTitle>
            <Trans>Collect Babylon Points on BOB</Trans>
          </BannerTitle>
        </Flex>
        <P color='grey-50'>
          <Trans>
            To celebrate BOB becoming a Bitcoin-Secured Network, collect extra Babylon Points by using Babylon LSTs in
            DeFi. Read more &gt;
          </Trans>
        </P>
      </StyledBannerContent>
      <StyledImg
        $hasImgOpacity={hasImgOpacity}
        alt={t(i18n)`Babylon campaign`}
        height='134'
        placeholder='blur'
        src={babylon}
        width='312'
      />
    </Banner>
  );
};

export { BabylonBanner };
