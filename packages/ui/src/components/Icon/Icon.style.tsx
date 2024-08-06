import styled from 'styled-components';
import { css } from 'styled-components';

import { Color, IconsSizes } from '../../theme';

type StyledIconProps = {
  $size: IconsSizes;
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
    ${theme.icon($size, $color)}
    width: ${$width};
    height: ${$height};
  `}
`;

export { StyledIcon };
