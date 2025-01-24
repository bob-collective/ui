import { Card, Flex } from '@gobob/ui';
import styled from 'styled-components';

type StyledTokenListItemProps = {
  $isFocused?: boolean;
};

const StyledWalletCard = styled(Card)`
  min-height: 3.375rem;
`;

const StyledTokenListItem = styled(Card)<StyledTokenListItemProps>`
  cursor: pointer;

  &:hover,
  &:focus-visible {
    ${({ theme }) => theme.list.item.hover}
  }

  ${({ theme, $isFocused }) => $isFocused && theme.list.item.selected}
`;

const StyledMissingImageLogo = styled.div`
  border-radius: ${({ theme }) => theme.rounded('full')};
  width: ${({ theme }) => theme.spacing('5xl')};
  height: ${({ theme }) => theme.spacing('5xl')};
  background-color: ${({ theme }) => theme.color('primary-800')};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledEthAvatarOverlay = styled(Flex)`
  inset: 0;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 99999;
`;

export { StyledTokenListItem, StyledEthAvatarOverlay, StyledWalletCard, StyledMissingImageLogo };
