import { Button, Card } from '@gobob/ui';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  padding: 0.625rem 2rem;
`;

const StyledCard = styled(Card)`
  position: relative;
  border-radius: ${({ theme }) => theme.rounded('3xl')};
`;

export { StyledButton, StyledCard };
