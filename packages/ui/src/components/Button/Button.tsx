import { PressEvent } from '@react-types/shared';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Slottable } from '@radix-ui/react-slot';

import { useDOMRef } from '../../hooks';
import { ButtonVariants, ButtonSizes, ButtonColors, SpinnerSizes, SpinnerColors } from '../../theme';
import { Flex } from '../Flex';
import { Spinner } from '../Spinner';
import { ElementTypeProp } from '../utils/types';

import { StyledButton } from './Button.style';

const spinnerSizeMap: Record<ButtonSizes, SpinnerSizes> = {
  s: 's',
  md: 's',
  lg: 'md',
  xl: 'md',
  '2xl': 'lg'
};

const spinnerColorMap: Record<ButtonColors, Record<ButtonVariants, SpinnerColors>> = {
  default: {
    ghost: 'default',
    outline: 'default',
    solid: 'default'
  },
  primary: {
    ghost: 'primary',
    outline: 'primary',
    solid: 'default'
  },
  light: {
    ghost: 'primary',
    outline: 'primary',
    solid: 'default'
  }
};

type Props = {
  variant?: ButtonVariants;
  fullWidth?: boolean;
  size?: ButtonSizes;
  color?: ButtonColors;
  loading?: boolean;
  isIconOnly?: boolean;
  asChild?: boolean;
  onPress?: (e: PressEvent) => void;
};

type NativeAttrs = Omit<ButtonHTMLAttributes<unknown>, keyof Props>;

type ButtonProps = Props & NativeAttrs & ElementTypeProp;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      loading,
      disabled,
      variant = 'solid',
      size = 'md',
      color = 'default',
      fullWidth,
      isIconOnly,
      asChild,
      elementType,
      ...props
    },
    ref
  ): JSX.Element => {
    const domRef = useDOMRef(ref);

    const isDisabled = disabled || loading;

    return (
      <StyledButton
        ref={domRef}
        $color={color}
        $fullWidth={fullWidth}
        $isIconOnly={isIconOnly}
        $size={size}
        $variant={variant}
        as={elementType}
        asChild={asChild}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <Flex elementType='span' marginRight={isIconOnly ? undefined : 's'}>
            <Spinner aria-label='Loading...' color={spinnerColorMap[color][variant]} size={spinnerSizeMap[size]} />
          </Flex>
        )}
        {isIconOnly ? loading ? undefined : <Slottable>{children}</Slottable> : <Slottable>{children}</Slottable>}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
