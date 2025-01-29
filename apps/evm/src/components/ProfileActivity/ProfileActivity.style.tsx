import { Card, Flex, UnstyledButton, hexToRgba } from '@gobob/ui';
import styled from 'styled-components';

type StyledTransactionItemCardProps = {
  $isExpanded?: boolean;
  $isShowMoreHovered?: boolean;
};

const StyledTransactionList = styled(Flex)`
  flex: 1 1 auto;
`;

const StyledShowMore = styled(UnstyledButton)`
  display: flex;
  justify-content: center;
  width: 100%;
  border-bottom-left-radius: ${({ theme }) => theme.rounded('md')};
  border-bottom-right-radius: ${({ theme }) => theme.rounded('md')};
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding-top: ${({ theme }) => theme.spacing('lg')};
  padding-bottom: ${({ theme }) => theme.spacing('lg')};
`;

const StyledTransactionItemCard = styled(Card)<StyledTransactionItemCardProps>`
  position: relative;
  padding-bottom: ${({ theme, $isExpanded }) => $isExpanded && theme.spacing('5xl')};

  transition: background 200ms ease-in-out;

  &:hover {
    background-color: ${({ theme, $isExpanded }) => !$isExpanded && hexToRgba(theme.color('grey-300'), 30)};
  }

  background: ${({ theme, $isShowMoreHovered, $isExpanded }) =>
    $isExpanded &&
    `linear-gradient(${theme.color('grey-400')} 70%, ${theme.color($isShowMoreHovered ? 'grey-700' : 'grey-500')} 100%)`};
`;

export { StyledShowMore, StyledTransactionItemCard, StyledTransactionList };
