import { Skeleton } from '@gobob/ui';
import styled from 'styled-components';

const StyledHeaderWrapper = styled.div`
  position: relative;
`;

const StyledSkeleton = styled(Skeleton)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0.9;
`;

export { StyledHeaderWrapper, StyledSkeleton };
