import styled from 'styled-components';

import { unstyledButtonCSS, UnstyledButtonProps } from '../utils';

const StyledButton = styled.button<UnstyledButtonProps>`
  ${(props) => unstyledButtonCSS(props)}
`;

export { StyledButton };
