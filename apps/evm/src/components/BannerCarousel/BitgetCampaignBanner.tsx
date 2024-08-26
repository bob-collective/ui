import { Flex, P } from '@gobob/ui';

import bitgetCampaignImg from '../../assets/bitget-wallet-campaign.png';

import { Banner } from './Banner';
import { StyledBitgetCampaignImg } from './BannerCarousel.style';
import { BannerTitle } from './BannerTitle';

type BitgetCampaignBannerProps = {
  onPress?: () => void;
};

const BitgetCampaignBanner = ({ onPress }: BitgetCampaignBannerProps) => (
  <Banner isPressable direction='column' onPress={onPress}>
    <Flex alignItems='center'>
      <BannerTitle>137.5M Spice Points up for Grabs!</BannerTitle>
    </Flex>
    <P color='grey-50'>August 26th - September 15th</P>
    <StyledBitgetCampaignImg src={bitgetCampaignImg} />
  </Banner>
);

export { BitgetCampaignBanner };
