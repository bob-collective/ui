import { Flex, P } from '@gobob/ui';

import { StyledBannerContent, StyledOnrampImg } from './BannerCarousel.style';
import { Banner } from './Banner';
import { BannerTitle } from './BannerTitle';

type OnrampBannerProps = {
  onPress?: () => void;
};

const OnrampBanner = ({ onPress }: OnrampBannerProps) => (
  <Banner isPressable gap='md' justifyContent='space-between' onPress={onPress}>
    <StyledBannerContent direction='column' justifyContent='center'>
      <Flex alignItems='center'>
        <BannerTitle size='2xl' weight='bold'>
          BOB Gateway is live!
        </BannerTitle>
      </Flex>
      <P color='grey-50'>The fastest and easiest way to bridge BTC to BOB</P>
    </StyledBannerContent>
    <StyledOnrampImg />
  </Banner>
);

export { OnrampBanner };
