import styled, { CSSProperties, css } from 'styled-components';

import { Flex } from '../Flex';
import { Label } from '../Label';
import { FieldSizes, Theme } from '../../theme';

const sizeCSS = (theme: Theme, size: FieldSizes) =>
  ({
    s: {
      top: theme.spacing('s'),
      left: `calc(${theme.spacing('md')} + 2px)`
    },
    md: {
      top: theme.spacing('md'),
      left: `calc(${theme.spacing('lg')} + 2px)`
    },
    lg: {
      top: theme.spacing('md'),
      left: `calc(${theme.spacing('xl')} + 2px)`
    }
  })[size];

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
  ${({ position, theme, size = 'md' }) =>
    position === 'inside' &&
    css`
      position: absolute;
      z-index: 10;

      ${sizeCSS(theme, size)}
    `}
`;

export { StyledField, StyledFieldElWrapper, StyledLabel };
