'use client';
import { ImgHTMLAttributes } from 'react';

import { Color, Rounded, Spacing } from '../../theme';

import { StyledAvatar } from './Avatar.style';

type Props = {
  size?: Spacing;
  background?: Color;
  rounded?: Rounded;
};

type InheritAttrs = Omit<ImgHTMLAttributes<unknown>, keyof Props>;

type AvatarProps = Props & InheritAttrs;

const Avatar = ({ size = '4xl', background, rounded = 'full', ...props }: AvatarProps) => (
  <StyledAvatar $background={background} $rounded={rounded} $size={size} {...props} />
);

export { Avatar };
export type { AvatarProps };
