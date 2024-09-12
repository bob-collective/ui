import { Color, Rounded, TextProps } from '@gobob/ui';
import { HtmlHTMLAttributes } from 'react';

import { StyledSpan } from './Trapezoid.style';

type Props = {
  size?: TextProps['size'];
  color?: TextProps['color'];
  rounded?: Rounded | { topLeft?: Rounded; topRight?: Rounded; bottomLeft?: Rounded; bottomRight?: Rounded };
  direction?: 'normal' | 'inverted';
  background?: Color;
};

type NativeAttrs = Omit<HtmlHTMLAttributes<unknown>, keyof Props>;

type TrapezoidProps = Props & NativeAttrs;

const Trapezoid = ({
  size,
  color,
  children,
  direction = 'normal',
  background = 'grey-500',
  ...props
}: TrapezoidProps) => (
  <div {...props}>
    <StyledSpan $background={background} $direction={direction} color={color} size={size}>
      {children}
    </StyledSpan>
  </div>
);

export { Trapezoid };
