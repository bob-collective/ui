import { CardProps } from '@gobob/ui';

import { StyledBanner } from './BannerCarousel.style';

type BannerProps = CardProps;

const Banner = (props: BannerProps) => {
  return (
    <StyledBanner bordered={false} direction='row' paddingX={{ base: '2xl', s: '6xl' }} paddingY='5xl' {...props} />
  );
};

export { Banner };
