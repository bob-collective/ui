import { ImgHTMLAttributes } from 'react';

import { Color, ResponsiveProp, Rounded, Spacing } from '../../theme';

import { StyledAvatar } from './Avatar.style';

type Props = {
  size?: ResponsiveProp<Spacing>;
  background?: Color;
  rounded?: Rounded;
  borderColor?: Color;
};

type InheritAttrs = Omit<ImgHTMLAttributes<unknown>, keyof Props>;

type AvatarProps = Props & InheritAttrs;

// TODO: add fallback?
const Avatar = ({ size = '4xl', background, rounded = 'full', borderColor, ...props }: AvatarProps) => (
  <StyledAvatar $background={background} $borderColor={borderColor} $rounded={rounded} $size={size} {...props} />
);

export { Avatar };
export type { AvatarProps };
