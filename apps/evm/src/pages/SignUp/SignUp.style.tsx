import { Flex } from '@gobob/ui';
import styled from 'styled-components';

const StyledAuthSection = styled(Flex)`
  width: 100%;
  max-width: ${({ theme }) => theme.maxWidth('s')};
`;

const StyledContainer = styled(Flex)`
  width: 100%;
`;

export { StyledAuthSection, StyledContainer };
