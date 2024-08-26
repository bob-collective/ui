import styled from 'styled-components';

import { Color, Rounded, Spacing } from '../../theme';

type StyledAvatarProps = {
  $size: Spacing;
  $background?: Color;
  $borderColor?: Color;
  $rounded: Rounded;
};

const StyledAvatar = styled.img<StyledAvatarProps>`
  ${({ theme, $size }) => ({ height: theme.spacing($size), width: theme.spacing($size) })}
  border-radius: ${({ theme, $rounded }) => theme.rounded($rounded)};
  background-color: ${({ theme, $background }) => $background && theme.color($background)};
  border: ${({ $borderColor, theme }) => $borderColor && `1px solid ${theme.color($borderColor)}`};
`;

export { StyledAvatar };
