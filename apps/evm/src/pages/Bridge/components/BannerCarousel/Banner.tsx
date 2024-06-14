import { Flex, FlexProps } from '@gobob/ui';

type BannerProps = FlexProps;

const Banner = (props: BannerProps) => {
  return <Flex paddingX={{ base: '2xl', s: '6xl' }} paddingY='5xl' {...props} />;
};

export { Banner };
export type { BannerProps };
