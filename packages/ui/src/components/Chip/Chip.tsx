import { ImgHTMLAttributes, ReactNode } from 'react';

import { ChipSize, Color, Rounded } from '../../theme';

import { StyledChip, StyledContent } from './Chip.style';

type Props = {
  size?: ChipSize;
  background?: Color;
  rounded?: Rounded;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  borderColor?: Color;
};

type InheritAttrs = Omit<ImgHTMLAttributes<unknown>, keyof Props>;

type ChipProps = Props & InheritAttrs;

const Chip = ({
  size = 'md',
  background,
  rounded,
  children,
  startAdornment,
  endAdornment,
  borderColor,
  ...props
}: ChipProps) => (
  <StyledChip $background={background} $borderColor={borderColor} $rounded={rounded} $size={size} {...props}>
    {startAdornment}
    <StyledContent
      $hasEndAdornment={!!endAdornment}
      $hasStartAdornment={!!startAdornment}
      $size={size}
      color='inherit'
      size='inherit'
    >
      {children}
    </StyledContent>
    {endAdornment}
  </StyledChip>
);

export { Chip };
export type { ChipProps };
