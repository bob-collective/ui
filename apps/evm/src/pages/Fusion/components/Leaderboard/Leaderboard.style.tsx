import { Span, Table } from '@gobob/ui';
import styled from 'styled-components';

const StyledGrid = styled(Span)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 80px;
`;

const StyledTable = styled(Table)`
  max-height: calc(100dvh - 13rem);
`;

export { StyledGrid, StyledTable };
