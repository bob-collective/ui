import { H1Props } from '@gobob/ui';

import { StyledBannerTitle } from './BannerCarousel.style';

type BannerTitleProps = H1Props;

const BannerTitle = (props: BannerTitleProps) => {
  return <StyledBannerTitle size='2xl' weight='bold' {...props} />;
};

export { BannerTitle };
