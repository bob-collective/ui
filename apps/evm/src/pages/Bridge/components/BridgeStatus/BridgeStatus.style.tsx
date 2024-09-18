import { Spinner, Link } from '@gobob/ui';
import { P } from '@gobob/ui';
import styled from 'styled-components';
import { AuthButton } from '@gobob/connect-ui';

import { BridgeStepStatus } from '../../../../constants';

type StyledPillProps = {
  $status: BridgeStepStatus;
};

const StyledPill = styled(Link)<StyledPillProps>`
  display: inline-flex;
  width: min-content;
  white-space: nowrap;
  gap: ${({ theme }) => theme.spacing('xs')};
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing('xs')} ${theme.spacing('lg')}`};
  border-radius: ${({ theme }) => theme.rounded('full')};
  background-color: ${({ theme, $status }) =>
    $status === 'complete'
      ? theme.color('grey-600')
      : $status === 'ongoing'
        ? theme.color('green-300')
        : $status === 'failed'
          ? theme.color('red-800')
          : theme.color('grey-600')};
  opacity: ${({ $status }) => ($status === 'idle' ? '.7' : '1')};
  color: ${({ $status, theme }) => ($status === 'ongoing' ? theme.color('dark') : theme.color('light'))};

  &,
  &:hover {
    text-decoration: none;
  }
`;

const StyledLoadingSpinner = styled(Spinner)`
  border-bottom-color: transparent;
  border-left-color: ${({ theme }) => theme.color('dark')};
  border-top-color: ${({ theme }) => theme.color('dark')};
  border-right-color: ${({ theme }) => theme.color('dark')};
`;

const StyledTimePill = styled(P)`
  padding: ${({ theme }) => `${theme.spacing('xs')} ${theme.spacing('lg')}`};
  border-radius: ${({ theme }) => theme.rounded('full')};
  background-color: ${({ theme }) => theme.color('grey-400')};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing('xs')};
`;

const StyledStatusActionButton = styled(AuthButton)`
  height: ${({ theme }) => theme.spacing('4xl')};
`;

export { StyledLoadingSpinner, StyledPill, StyledStatusActionButton, StyledTimePill };
