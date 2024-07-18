import { Span } from '@gobob/ui';
import styled from 'styled-components';

const StyledLogo = styled(Span)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing('s')};
  text-decoration: none;
`;

export { StyledLogo };
