import { ResponsiveProp, Rounded, Spacing } from '../../theme';
import { FlexProps } from '../Flex';

import { StyledSkeleton, StyledSkeletonWrapper } from './Skeleton.style';

type Props = {
  height?: ResponsiveProp<Spacing | string | number>;
  width?: ResponsiveProp<Spacing | string | number>;
  rounded?: Rounded;
  count?: number;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type SkeletonProps = Props & InheritAttrs;

const Skeleton = ({ height, width, rounded = 'xs', count, ...props }: SkeletonProps) => (
  <StyledSkeletonWrapper {...props} elementType='span'>
    <StyledSkeleton $height={height} $rounded={rounded} $width={width} count={count} />
  </StyledSkeletonWrapper>
);

export { Skeleton };
export type { SkeletonProps };
