import styled, { CSSProperties, css } from 'styled-components';

import { Flex } from '../Flex';
import { Label } from '../Label';
import { FieldSizes, Theme } from '../../theme';

const sizeCSS = (theme: Theme, size: FieldSizes) =>
  ({
    s: {
      top: theme.spacing('xs'),
      left: `calc(${theme.spacing('lg')} + 1px)`
    },
    md: {
      top: theme.spacing('s'),
      left: `calc(${theme.spacing('lg')} + 1px)`
    },
    lg: {
      top: theme.spacing('md'),
      left: `calc(${theme.spacing('lg')} + 1px)`
    }
  })[size];

type StyledFieldProps = {
  $maxWidth?: CSSProperties['maxWidth'];
  $fullWidth?: boolean;
  $disabled?: boolean;
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
  opacity: ${({ $disabled }) => $disabled && '.5'};
`;

const StyledLabel = styled(Label)`
  ${({ position, theme, size = 'md' }) =>
    position === 'inside' &&
    css`
      position: absolute;
      z-index: 10;
      // TODO: figure something out because this is not safe (added because it prevented hover)
      pointer-events: none;

      ${sizeCSS(theme, size)}
    `}
`;

export { StyledField, StyledFieldElWrapper, StyledLabel };
