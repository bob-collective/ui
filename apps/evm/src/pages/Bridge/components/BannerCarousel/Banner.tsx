import { CardProps, Flex } from '@gobob/ui';

type BannerProps = CardProps;

const Banner = (props: BannerProps) => {
  return <Flex paddingX='2xl' paddingY='4xl' {...props} />;
};

export { Banner };
export type { BannerProps };
