import { Flex, H1, P } from '@gobob/ui';

import { StyledBannerContent, StyledOnrampBanner, StyledOnrampGraphic } from './BannerCarousel.style';

const OnrampBanner = () => {
  return (
    <StyledOnrampBanner gap='md' justifyContent='space-between'>
      <StyledBannerContent direction='column'>
        <Flex alignItems='center'>
          <H1 size='2xl' weight='bold'>
            BOB Onramp is live!
          </H1>
        </Flex>
        <P color='grey-200'>The fastest anda easiest way to bridge BTC to BOB</P>
      </StyledBannerContent>
      <StyledOnrampGraphic />
    </StyledOnrampBanner>
  );
};

export { OnrampBanner };
