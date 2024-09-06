import { Card } from '@gobob/ui';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  background-color: ${({ theme }) => theme.color('grey-600')};
`;

export { StyledCard };
