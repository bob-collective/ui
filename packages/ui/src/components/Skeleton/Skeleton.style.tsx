import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';

import { ResponsiveProp, Rounded, Spacing } from '../../theme';
import { getResponsiveCSS } from '../utils/responsive';
import { Flex } from '../Flex';

type StyledSkeletonProps = {
  $height?: ResponsiveProp<Spacing | string | number>;
  $width?: ResponsiveProp<Spacing | string | number>;
  $rounded: Rounded;
};

const StyledSkeleton = styled(Skeleton)<StyledSkeletonProps>`
  ${({ theme, $height }) =>
    $height && getResponsiveCSS(theme, 'height', $height, (prop) => theme.spacing(prop as Spacing) || prop)}
  ${({ theme, $width }) =>
    $width && getResponsiveCSS(theme, 'width', $width, (prop) => theme.spacing(prop as Spacing) || prop)}
  line-height: ${({ $height }) => $height && 'unset'};
  border-radius: ${({ theme, $rounded }) => theme.rounded($rounded)};
`;

const StyledSkeletonWrapper = styled(Flex)`
  > span {
    flex: 1;
  }
`;

export { StyledSkeleton, StyledSkeletonWrapper };
