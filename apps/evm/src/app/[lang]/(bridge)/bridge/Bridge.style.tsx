import { Card, Flex } from '@gobob/ui';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  width: 100%;
  min-width: 100%;
`;

const StyledWrapper = styled(Flex)`
  width: 100%;
  max-width: ${({ theme }) => theme.maxWidth('lg')};
`;

export { StyledCard, StyledWrapper };
