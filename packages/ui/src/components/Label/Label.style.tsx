import styled, { css } from 'styled-components';

import { LabelSizes, Theme } from '../../theme';

const sizeCSS = (theme: Theme, size: LabelSizes) =>
  ({
    s: theme.typography('s'),
    md: theme.typography('s'),
    lg: theme.typography('md')
  })[size];

type StyledLabelProps = {
  $error?: boolean;
  $size: LabelSizes;
};

const StyledLabel = styled.label<StyledLabelProps>`
  ${({ theme, $error, $size }) => css`
    ${sizeCSS(theme, $size)}
    ${theme.label.base}
    ${$error && theme.label.error.base}

    font-weight: ${theme.fontWeight('medium')};
    align-self: flex-start;
    padding-right: ${theme.spacing('xs')};
  `}
`;

export { StyledLabel };
