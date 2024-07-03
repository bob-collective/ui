import styled, { CSSProperties, css } from 'styled-components';

import { Flex } from '../Flex';
import { Label } from '../Label';

type StyledFieldProps = {
  $maxWidth?: CSSProperties['maxWidth'];
  $fullWidth?: boolean;
};

const StyledFieldElWrapper = styled.div`
  position: relative;
  box-sizing: border-box;
  display: inline-flex;
  height: 100%;
`;

const StyledField = styled(Flex)<StyledFieldProps>`
  max-width: ${({ $maxWidth }) => $maxWidth};
  width: ${({ $fullWidth, $maxWidth }) => ($fullWidth || $maxWidth) && '100%'};
  position: relative;
`;

const StyledLabel = styled(Label)`
  ${({ position, theme }) =>
    position === 'inside' &&
    css`
      position: absolute;
      z-index: 10;
      top: ${theme.spacing('s')};
      left: calc(${theme.spacing('lg')} + 2px);
    `}
`;

export { StyledField, StyledFieldElWrapper, StyledLabel };
