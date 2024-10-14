import { Flex, P } from '@gobob/ui';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { Banner } from './Banner';
import { StyledBannerContent, StyledBinanceCampaignImg } from './BannerCarousel.style';
import { BannerTitle } from './BannerTitle';

type BinanceCampaignBannerProps = {
  onPress?: () => void;
};

const BinanceCampaignBanner = ({ onPress }: BinanceCampaignBannerProps) => {
  const { i18n } = useLingui();

  return (
    <Banner isPressable direction='column' justifyContent='center' onPress={onPress}>
      <StyledBannerContent direction='column'>
        <Flex alignItems='center'>
          <BannerTitle>
            <Trans>Bitcoin Staking with Binance</Trans>
          </BannerTitle>
        </Flex>
        <P color='grey-50'>
          <Trans>An exclusive quest campaign.</Trans>
        </P>
      </StyledBannerContent>
      <StyledBinanceCampaignImg
        alt={t(i18n)`Binance campaign banner`}
        height='145'
        src='/assets/binance-campaign.png'
        width='336'
      />
    </Banner>
  );
};

export { BinanceCampaignBanner };
