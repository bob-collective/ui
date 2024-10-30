import { Flex, P } from '@gobob/ui';
import { Trans } from '@lingui/macro';

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
          <Trans>BOB Gateway is live!</Trans>
        </BannerTitle>
      </Flex>
      <P color='grey-50'>
        <Trans>The fastest and easiest way to bridge BTC to BOB.</Trans>
      </P>
    </StyledBannerContent>
    <StyledOnrampImg />
  </Banner>
);

export { OnrampBanner };
