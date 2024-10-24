import { ChainId } from '@gobob/chains';
import { Select } from '@gobob/ui';
import styled from 'styled-components';

const StyledSelect = styled(Select<{ id: ChainId | 'BTC' }>)`
  width: 100%;
`;

export { StyledSelect };
