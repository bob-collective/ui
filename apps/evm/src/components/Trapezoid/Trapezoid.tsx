import { Color, Rounded, TextProps } from '@gobob/ui';
import { HtmlHTMLAttributes } from 'react';

import { StyledSpan, StyledWrapper } from './Trapezoid.style';

type Props = {
  size?: TextProps['size'];
  color?: TextProps['color'];
  rounded?: Rounded | { topLeft?: Rounded; topRight?: Rounded; bottomLeft?: Rounded; bottomRight?: Rounded };
  direction?: 'normal' | 'inverted';
  background?: Color;
  borderColor?: Color | string;
};

type NativeAttrs = Omit<HtmlHTMLAttributes<unknown>, keyof Props>;

type TrapezoidProps = Props & NativeAttrs;

const Trapezoid = ({
  size,
  color,
  children,
  direction = 'normal',
  background = 'grey-500',
  borderColor,
  rounded,
  ...props
}: TrapezoidProps) => (
  <StyledWrapper {...props}>
    <StyledSpan
      $background={background}
      $borderColor={borderColor}
      $direction={direction}
      $rounded={rounded}
      color={color}
      size={size}
    >
      {children}
    </StyledSpan>
  </StyledWrapper>
);

export { Trapezoid };
