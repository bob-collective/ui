import { P } from '@gobob/ui';
import styled from 'styled-components';

import { AuthButton } from '@/connect-ui';

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

export { StyledStatusActionButton, StyledTimePill };
