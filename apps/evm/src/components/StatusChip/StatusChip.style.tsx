import { Link, Spinner } from '@gobob/ui';
import styled from 'styled-components';

import { BridgeStepStatus } from '@/types';

type StyledChipProps = {
  $status: BridgeStepStatus;
};

const StyledChip = styled(Link)<StyledChipProps>`
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
  border: ${({ theme, $status }) =>
    $status === 'complete' || $status === 'idle' ? `1px solid ${theme.color('grey-200')}` : '1px solid transparent'};
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

export { StyledLoadingSpinner, StyledChip };
