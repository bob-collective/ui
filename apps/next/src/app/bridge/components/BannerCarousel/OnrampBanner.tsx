import { Flex, H1, P } from '@gobob/ui';
import Image from 'next/image';

// import img from '../../../../assets/cubs-group.png';

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
      <P color='grey-200'>The fastest and easiest way to bridge BTC to BOB</P>
    </StyledBannerContent>
    <StyledOnrampGraphic />
    <Image
      fill
      alt='Picture of the author'
      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      src='/assets/cubs-group.png'
    />
  </StyledOnrampBanner>
);

export { OnrampBanner };
