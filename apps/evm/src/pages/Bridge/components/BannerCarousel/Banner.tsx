import { CardProps } from '@gobob/ui';

import { StyledBanner } from './BannerCarousel.style';

type BannerProps = CardProps;

const Banner = (props: BannerProps) => {
  return (
    <StyledBanner disableAnimation direction='row' paddingX={{ base: '2xl', s: '7xl' }} paddingY='5xl' {...props} />
  );
};

export { Banner };
