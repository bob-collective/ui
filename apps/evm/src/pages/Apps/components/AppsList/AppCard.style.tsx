import { Flex } from '@gobob/ui';
import styled from 'styled-components';

import { SpiceChip } from '../SpiceChip';

const StyledImgWrapper = styled(Flex)`
  position: relative;
  background: radial-gradient(81.15% 494.89% at 46.85% 41.99%, #474d58 0%, #1e2430 18.5%, #040404 57.5%);
`;

const StyledSpiceChip = styled(SpiceChip)`
  position: absolute;
  top: ${({ theme }) => theme.spacing('md')};
  right: ${({ theme }) => theme.spacing('md')};
`;

export { StyledImgWrapper, StyledSpiceChip };
