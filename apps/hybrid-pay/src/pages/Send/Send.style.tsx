import { Input } from '@gobob/ui';
import styled from 'styled-components';

const StyledInput = styled(Input)`
  input {
    padding: ${({ theme }) => `${theme.spacing('xl')} ${theme.spacing('lg')}`};
    font-size: ${({ theme }) => theme.fontSize('s')};
  }
`;

export { StyledInput };
