import { Button, Card } from '@gobob/ui';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  padding: 0.625rem 2rem;
`;

const StyledCard = styled(Card)`
  position: relative;
  background-image: url(/assets/lottery.png);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  min-height: 300px;
  min-width: 500px;
`;

export { StyledButton, StyledCard };
