import { Flex, H2 } from '@gobob/ui';
import styled from 'styled-components';

const StyledBannerContent = styled(Flex)`
  max-width: ${({ theme }) => theme.maxWidth('2xl')};
  z-index: 1;
`;

const StyledBannerTitle = styled(H2)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export { StyledBannerContent, StyledBannerTitle };
