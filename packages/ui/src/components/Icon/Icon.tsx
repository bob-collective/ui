import { SVGAttributes, forwardRef } from 'react';

import { Color, IconsSizes, ResponsiveProp } from '../../theme';

import { StyledIcon } from './Icon.style';

type Props = {
  size?: ResponsiveProp<IconsSizes>;
  color?: Color;
};

type NativeAttrs<T = unknown> = Omit<SVGAttributes<T>, keyof Props>;

type IconProps<T = unknown> = Props & NativeAttrs<T>;

const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 'md', color, width, height, ...props }, ref): JSX.Element => (
    <StyledIcon ref={ref} $color={color} $height={height} $size={size} $width={width} {...props} />
  )
);

Icon.displayName = 'Icon';

export { Icon };
export type { IconProps };
