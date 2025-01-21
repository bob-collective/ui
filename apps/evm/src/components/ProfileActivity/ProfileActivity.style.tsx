import { ArrowDownCircle, Button, Card, Flex, Span, UnstyledButton, hexToRgba } from '@gobob/ui';
import styled from 'styled-components';

type StyledExpandIconProps = {
  $isExpanded?: boolean;
};

type StyledTransactionItemCardProps = {
  $isExpanded?: boolean;
  $isShowMoreHovered?: boolean;
};

type StyledVirtualizerProps = {
  $height: number;
};

type StyledVirtualizerItemProps = {
  $translateY: number;
};

const StyledSpan = styled(Span)`
  display: inline-flex;
  align-items: center;
  position: relative;
  margin-left: ${({ theme }) => theme.spacing('md')};
  padding: 0 ${({ theme }) => theme.spacing('s')};
  height: 24px;
  border-radius: ${({ theme }) => theme.rounded('full')};
`;

const StyledSpinnerWrapper = styled.span`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
`;

const StyledTransactionList = styled(Flex)`
  flex: 1 1 auto;
`;

const StyledTransactionListWrapper = styled(Flex)`
  overflow: hidden;
`;

const StyledTransactionListParent = styled.div`
  height: 100%;
  overflow: auto;
`;

const StyledVirtualizer = styled.div<StyledVirtualizerProps>`
  width: 100%;
  position: relative;
  height: ${({ $height }) => `${$height}px`};
`;

const StyledVirtualizerItem = styled.div<StyledVirtualizerItemProps>`
  position: absolute;
  width: 100%;
  transform: ${({ $translateY }) => `translateY(${$translateY}px)`};
`;

const StyledDetailsButton = styled(Flex)`
  font: inherit;
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing('md')};
  padding: ${({ theme }) => `${theme.spacing('md')} 0`};
`;

const StyledExpandIcon = styled(ArrowDownCircle)<StyledExpandIconProps>`
  ${({ theme }) => theme.transition('common', 'normal')};
  transform: ${({ $isExpanded }) => ($isExpanded ? 'rotate(-180deg)' : 'rotate(0deg)')};
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

const StyledFilterButton = styled(Button)`
  gap: ${({ theme }) => theme.spacing('s')};
`;

export {
  StyledDetailsButton,
  StyledExpandIcon,
  StyledFilterButton,
  StyledShowMore,
  StyledSpan,
  StyledSpinnerWrapper,
  StyledTransactionItemCard,
  StyledTransactionList,
  StyledTransactionListParent,
  StyledTransactionListWrapper,
  StyledVirtualizer,
  StyledVirtualizerItem
};
