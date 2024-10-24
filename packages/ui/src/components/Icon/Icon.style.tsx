import styled, { DefaultTheme } from 'styled-components';
import { css } from 'styled-components';

import { Color, IconsSizes, ResponsiveProp } from '../../theme';

const getResponsiveCSS = (theme: DefaultTheme, size: ResponsiveProp<IconsSizes>, color?: Color) =>
  typeof size === 'object'
    ? css`
        ${size.base && theme.breakpoints.media.base`${theme.icon(size.base, color)}`}
        ${size.s && theme.breakpoints.media.s`${theme.icon(size.s, color)}`}
        ${size.md && theme.breakpoints.media.md`${theme.icon(size.md, color)}`}
        ${size.lg && theme.breakpoints.media.lg`${theme.icon(size.lg, color)}`}
        ${size.xl && theme.breakpoints.media.xl`${theme.icon(size.xl, color)}`}
      `
    : size && theme.icon(size, color);

type StyledIconProps = {
  $size: ResponsiveProp<IconsSizes>;
  $color?: Color;
  $width?: string | number;
  $height?: string | number;
};

const StyledIcon = styled.svg<StyledIconProps>`
  display: inline-block;
  user-select: none;
  flex-shrink: 0;
  overflow: hidden;
  ${({ theme, $size, $color, $width, $height }) => css`
    ${getResponsiveCSS(theme, $size, $color)}
    width: ${$width && typeof $width === 'string' && ($width.includes('em') || $width.includes('rem'))
      ? $width
      : `${$width}px`};
    height: ${$height && typeof $height === 'string' && ($height.includes('em') || $height.includes('rem'))
      ? $height
      : `${$height}px`};
  `}
`;

export { StyledIcon };
