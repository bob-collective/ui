import { css } from 'styled-components';

import { getSpacingResponsiveCSS } from './responsive';

const paddingCSS = (props: any) => {
  const paddingTop = props.$paddingTop || props.$paddingY;
  const paddingBottom = props.$paddingBottom || props.$paddingY;
  const paddingLeft = props.$paddingLeft || props.$paddingX;
  const paddingRight = props.$paddingRight || props.$paddingX;

  return css`
    ${({ theme }) => getSpacingResponsiveCSS(theme, 'padding', props.$padding)}
    ${({ theme }) => getSpacingResponsiveCSS(theme, 'padding-top', paddingTop)}
  ${({ theme }) => getSpacingResponsiveCSS(theme, 'padding-bottom', paddingBottom)}
  ${({ theme }) => getSpacingResponsiveCSS(theme, 'padding-left', paddingLeft)}
  ${({ theme }) => getSpacingResponsiveCSS(theme, 'padding-right', paddingRight)}
  `;
};

export { paddingCSS };
