import { Flex } from '@gobob/ui';
import styled from 'styled-components';

const StyledBannerContent = styled(Flex)`
  max-width: ${({ theme }) => theme.maxWidth('2xl')};
  z-index: 1;
`;

export { StyledBannerContent };
