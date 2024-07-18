import styled from 'styled-components';
import { Card } from '@gobob/ui';

const StyledCard = styled(Card)`
  border: 1px solid transparent;

  &[aria-selected='true'] {
    border: 1px solid ${({ theme }) => theme.color('primary-500')};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.color('primary-500')};
  }
`;

export { StyledCard };
