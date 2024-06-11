import { ChainId } from '@gobob/chains';
import { Select } from '@gobob/ui';
import styled from 'styled-components';

const StyledSelect = styled(Select<{ id: ChainId | 'BTC' }>)`
  flex: 1 1 45%;
  max-width: 45%;
  width: 100%;

  button {
    padding: ${({ theme }) => `${theme.spacing('lg')} ${theme.spacing('lg')}`};
  }
`;

export { StyledSelect };
