import { UnstyledButton } from '@gobob/ui';
import styled from 'styled-components';

const StyledBackButton = styled(UnstyledButton)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing('md')};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing('lg')} 0;
`;

export { StyledBackButton };
