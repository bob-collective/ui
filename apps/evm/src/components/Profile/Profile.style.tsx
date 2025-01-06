import { Card } from '@gobob/ui';
import styled from 'styled-components';

type StyledTokenListItemProps = {
  $isFocused?: boolean;
};

const StyledWalletCard = styled(Card)`
  min-height: 3.375rem;
`;

const StyledTokenListItem = styled(Card)<StyledTokenListItemProps>`
  cursor: pointer;

  &:hover {
    ${({ theme }) => theme.list.item.hover}
  }

  ${({ theme, $isFocused }) => $isFocused && theme.list.item.selected}
`;

export { StyledTokenListItem, StyledWalletCard };
