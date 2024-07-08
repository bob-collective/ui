import { Span } from '@gobob/ui';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledLogo = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing('md')};
  text-decoration: none;
`;

// TODO: Create UI badge component
const StyledBadge = styled(Span)`
  border-radius: ${({ theme }) => theme.rounded('3xl')};
  background-color: ${({ theme }) => theme.color('grey-500')};
  padding: ${({ theme }) => `${theme.spacing('xs')} ${theme.spacing('md')}`};
`;

export { StyledLogo, StyledBadge };
