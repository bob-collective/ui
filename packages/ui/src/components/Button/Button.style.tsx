import styled from 'styled-components';

import { UnstyledButton } from '../UnstyledButton';
import { StyledButtonProps, buttonCSS } from '../utils';

const StyledButton = styled(UnstyledButton)<StyledButtonProps>`
  ${(props) => buttonCSS(props)}
`;

export { StyledButton };
