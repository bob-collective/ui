import { Flex, H1, P } from '@gobob/ui';

import { StyledBannerContent, StyledOnrampBanner, StyledOnrampGraphic } from './BannerCarousel.style';

type OnrampBannerProps = {
  onPress?: () => void;
};

const OnrampBanner = ({ onPress }: OnrampBannerProps) => (
  <StyledOnrampBanner isPressable gap='md' justifyContent='space-between' onPress={onPress}>
    <StyledBannerContent direction='column'>
      <Flex alignItems='center'>
        <H1 size='2xl' weight='bold'>
          BOB Gateway is live!
        </H1>
      </Flex>
      <P color='grey-50'>The fastest and easiest way to bridge BTC to BOB</P>
    </StyledBannerContent>
    <StyledOnrampGraphic />
  </StyledOnrampBanner>
);

export { OnrampBanner };
