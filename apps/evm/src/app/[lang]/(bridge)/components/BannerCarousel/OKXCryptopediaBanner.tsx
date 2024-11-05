import { Flex, P } from '@gobob/ui';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import okxCryptopediaBanner from '@public/assets/okx-cryptopedia.png';

import { Banner } from './Banner';
import { StyledBannerContent, StyledOKXCryptopediaImg } from './BannerCarousel.style';
import { BannerTitle } from './BannerTitle';

type OKXCryptopediaBannerProps = {
  onPress?: () => void;
};

const OKXCryptopediaBanner = ({ onPress }: OKXCryptopediaBannerProps) => {
  const { i18n } = useLingui();

  return (
    <Banner isPressable direction='column' justifyContent='center' onPress={onPress}>
      <StyledBannerContent direction='column'>
        <Flex alignItems='center'>
          <BannerTitle>
            <Trans>BOB Ecosystem on OKX Cryptopedia</Trans>
          </BannerTitle>
        </Flex>
        <P color='grey-50'>
          <Trans>An Exclusive Bitcoin Staking and DeFi Campaign</Trans>
        </P>
      </StyledBannerContent>
      <StyledOKXCryptopediaImg
        alt={t(i18n)`OKX Cryptopedia`}
        height='156'
        placeholder='blur'
        src={okxCryptopediaBanner}
        width='363'
      />
    </Banner>
  );
};

export { OKXCryptopediaBanner };
