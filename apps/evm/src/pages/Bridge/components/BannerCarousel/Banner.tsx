import { CardProps } from '@gobob/ui';

import { StyledBanner } from './BannerCarousel.style';

type BannerProps = CardProps;

const Banner = (props: BannerProps) => {
  return (
    <StyledBanner disableAnimation direction='row' paddingX={{ base: '3xl', s: '8xl' }} paddingY='6xl' {...props} />
  );
};

export { Banner };
