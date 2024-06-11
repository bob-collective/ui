import { P } from '@gobob/ui';
import styled from 'styled-components';

const StyledTableP = styled(P)`
  padding: ${({ theme }) => theme.spacing('md')} 0;
`;

const StyledList = styled.ul`
  list-style-type: disc;
  margin-left: ${({ theme }) => theme.spacing('3xl')};
  color: ${({ theme }) => theme.color('grey-200')};
`;

export { StyledTableP, StyledList };
