import { HTMLAttributes } from 'react';

import { ResponsiveProp, Rounded, Spacing } from '../../theme';
import { FlexProps } from '../Flex';

import { StyledSkeleton } from './Skeleton.style';

type Props = {
  height?: ResponsiveProp<Spacing | string | number>;
  width?: ResponsiveProp<Spacing | string | number>;
  rounded?: Rounded;
  count?: number;
  wrapperProps?: Omit<FlexProps, 'children'>;
};

type InheritAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type SkeletonProps = Props & InheritAttrs;

//github.com/styled-components/styled-components/issues/2113
const Skeleton = ({ height, width, rounded = 'xs', count, ...props }: SkeletonProps) => (
  <StyledSkeleton $height={height} $rounded={rounded} $width={width} count={count} {...props} />
);

export { Skeleton };
export type { SkeletonProps };
