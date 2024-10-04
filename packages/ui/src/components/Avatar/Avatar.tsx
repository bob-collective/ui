import { forwardRef, ImgHTMLAttributes } from 'react';

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
const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ size = '4xl', background, rounded = 'full', borderColor, ...props }, ref) => (
    <StyledAvatar
      ref={ref}
      $background={background}
      $borderColor={borderColor}
      $rounded={rounded}
      $size={size}
      {...props}
    />
  )
);

Avatar.displayName = 'Avatar';

export { Avatar };
export type { AvatarProps };
