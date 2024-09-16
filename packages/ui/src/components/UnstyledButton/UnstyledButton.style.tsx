import styled from 'styled-components';

import { Typography } from '../../theme';

type StyledButtonProps = {
  $isFocusVisible?: boolean;
  $size?: Typography;
};

const StyledButton = styled.button<StyledButtonProps>`
  background-color: transparent;
  cursor: pointer;
  border: 0;
  padding: 0;
  appearance: none;
  text-align: left;
  text-decoration: none;
  color: inherit;
  touch-action: manipulation;
  outline: ${({ $isFocusVisible }) => !$isFocusVisible && 'none'};
  ${({ theme, $size }) => $size && theme.typography($size)}
`;

export { StyledButton };
