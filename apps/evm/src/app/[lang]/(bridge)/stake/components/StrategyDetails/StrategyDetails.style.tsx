import { UnstyledButton } from '@gobob/ui';
import styled from 'styled-components';

const StyledAddressButton = styled(UnstyledButton)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing('xs')};
`;

export { StyledAddressButton };
