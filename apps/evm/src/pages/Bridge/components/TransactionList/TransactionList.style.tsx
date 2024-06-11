import { Card, Flex, Span, ArrowDownCircle } from '@gobob/ui';
import styled from 'styled-components';

type StyledExpandIconProps = {
  $isExpanded?: boolean;
};

const StyledSection = styled(Card)`
  width: 100%;
  overflow: hidden;
  max-height: calc(100vh - 16rem);
  min-height: 35rem;
`;

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
  overflow-y: auto;
  flex: 1 1 auto;
`;

const StyledTransactionListWrapper = styled(Flex)`
  overflow: hidden;
`;

const StyledViewTransactions = styled.a`
  display: flex;
  justify-content: space-between;
  text-decoration: none;
  flex-shrink: 0;
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
  StyledSection,
  StyledSpan,
  StyledSpinnerWrapper,
  StyledTransactionList,
  StyledTransactionListWrapper,
  StyledViewTransactions
};
