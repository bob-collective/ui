import styled, { css } from 'styled-components';

import { LabelSizes } from '../../theme';

type StyledLabelProps = {
  $error?: boolean;
  $size: LabelSizes;
};

const StyledLabel = styled.label<StyledLabelProps>`
  ${({ theme, $error, $size }) => css`
    ${theme.label.base}
    ${theme.label.size[$size]}
    ${$error && theme.label.error.base}
  `}
`;

export { StyledLabel };
