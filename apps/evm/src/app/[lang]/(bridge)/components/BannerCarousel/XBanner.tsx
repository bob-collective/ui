import { Flex, P } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import x from '@public/assets/x.png';

import { Banner } from './Banner';
import { StyledBannerContent, StyledXImg } from './BannerCarousel.style';
import { BannerTitle } from './BannerTitle';

type XBannerProps = {
  onPress?: () => void;
};

const XBanner = ({ onPress }: XBannerProps) => (
  <Banner isPressable direction='column' justifyContent='center' onPress={onPress}>
    <StyledBannerContent direction='column'>
      <Flex alignItems='center'>
        <BannerTitle>
          <Trans>Follow us on X</Trans>
        </BannerTitle>
      </Flex>
      <P color='grey-50'>
        <Trans>To stay up-to date with the BOB ecosystem follow @build_on_bob.</Trans>
      </P>
    </StyledBannerContent>
    <StyledXImg alt='x' height='123' placeholder='blur' src={x} width='336' />
  </Banner>
);

export { XBanner };