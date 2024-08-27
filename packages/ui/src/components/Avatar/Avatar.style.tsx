import styled from 'styled-components';

import { Color, ResponsiveProp, Rounded, Spacing } from '../../theme';
import { getSpacingResponsiveCSS } from '../utils/responsive';

type StyledAvatarProps = {
  $size: ResponsiveProp<Spacing>;
  $background?: Color;
  $borderColor?: Color;
  $rounded: Rounded;
};

const StyledAvatar = styled.img<StyledAvatarProps>`
  ${({ theme, $size }) => getSpacingResponsiveCSS(theme, 'height', $size)}
  ${({ theme, $size }) => getSpacingResponsiveCSS(theme, 'width', $size)}
  border-radius: ${({ theme, $rounded }) => theme.rounded($rounded)};
  background-color: ${({ theme, $background }) => $background && theme.color($background)};
  border: ${({ $borderColor, theme }) => $borderColor && `1px solid ${theme.color($borderColor)}`};
`;

export { StyledAvatar };
