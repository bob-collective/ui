import { Card } from '@gobob/ui';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  width: 100%;

  max-width: ${({ theme }) => theme.maxWidth('xl')};

  @media ${({ theme }) => theme.breakpoints.up('md')} {
    min-width: ${({ theme }) => theme.maxWidth('xl')};
  }
`;

export { StyledCard };
