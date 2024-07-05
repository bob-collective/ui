import styled, { css } from 'styled-components';

import { LabelPosition, LabelSizes, Theme } from '../../theme';

const sizeCSS = (theme: Theme, size: LabelSizes) =>
  ({
    s: theme.typography('xs'),
    md: theme.typography('s'),
    lg: theme.typography('md')
  })[size];

type StyledLabelProps = {
  $position: LabelPosition;
  $error?: boolean;
  $size: LabelSizes;
};

const StyledLabel = styled.label<StyledLabelProps>`
  ${({ theme, $position, $error, $size }) => css`
    ${sizeCSS(theme, $size)}
    ${theme.label.base}
    ${$error && theme.label.error.base}

    font-weight: ${theme.fontWeight('medium')};
    align-self: flex-start;

    padding: ${() => {
      switch ($position) {
        case 'inside':
          return `0 ${theme.spacing('xs')} 0 0`;
        case 'outside-left':
          // FIXME: padding bottom when position is on side
          return `${theme.spacing('s')} ${theme.spacing('xs')} 0.625rem 0`;
        case 'outside':
          return `${theme.spacing('xs')} 0`;
      }
    }};
  `}
`;

export { StyledLabel };
