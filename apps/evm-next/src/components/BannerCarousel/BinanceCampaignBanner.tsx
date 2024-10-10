import { Flex, P } from '@gobob/ui';

import { Banner } from './Banner';
import { StyledBannerContent, StyledBinanceCampaignImg } from './BannerCarousel.style';
import { BannerTitle } from './BannerTitle';

type BinanceCampaignBannerProps = {
  onPress?: () => void;
};

const BinanceCampaignBanner = ({ onPress }: BinanceCampaignBannerProps) => (
  <Banner isPressable direction='column' justifyContent='center' onPress={onPress}>
    <StyledBannerContent direction='column'>
      <Flex alignItems='center'>
        <BannerTitle>Bitcoin Staking with Binance</BannerTitle>
      </Flex>
      <P color='grey-50'>An exclusive quest campaign.</P>
    </StyledBannerContent>
    <StyledBinanceCampaignImg
      alt='Binance campaign banner'
      height='312'
      src='/assets/binance-campaign.png'
      width='725'
    />
  </Banner>
);

export { BinanceCampaignBanner };
