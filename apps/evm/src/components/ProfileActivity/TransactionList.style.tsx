import { Flex, Span, ArrowDownCircle } from '@gobob/ui';
import styled from 'styled-components';

type StyledExpandIconProps = {
  $isExpanded?: boolean;
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

export {
  StyledDetailsButton,
  StyledExpandIcon,
  StyledSpan,
  StyledSpinnerWrapper,
  StyledTransactionList,
  StyledTransactionListWrapper,
  StyledTransactionListParent,
  StyledVirtualizer,
  StyledVirtualizerItem
};
