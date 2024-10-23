import { Button, P } from '@gobob/ui';
import Lottie from 'lottie-react';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  flex: 1;
`;

const StyledLottie = styled(Lottie)`
  position: absolute;
`;

const StyledPoints = styled(P)`
  font-family: Chakra Petch;
  font-weight: 700;
  font-size: 3rem;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing('md')};
`;

export { StyledButton, StyledLottie, StyledPoints };
