import { Card } from '@gobob/ui';
import styled from 'styled-components';

const StyledWalletCard = styled(Card)`
  min-height: 3.375rem;
`;

const StyledTokenListItem = styled(Card)`
  cursor: pointer;

  &:hover {
    ${({ theme }) => theme.list.item.hover}
  }
`;

export { StyledTokenListItem, StyledWalletCard };
