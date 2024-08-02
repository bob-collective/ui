import { Card, CardProps } from '@gobob/ui';

type BannerProps = CardProps;

const Banner = (props: BannerProps) => {
  return <Card disableAnimation direction='row' paddingX={{ base: '2xl', s: '6xl' }} paddingY='5xl' {...props} />;
};

export { Banner };
