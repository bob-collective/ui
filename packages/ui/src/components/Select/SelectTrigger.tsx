import { useButton } from '@react-aria/button';
import { PressEvent } from '@react-types/shared';
import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { useHover } from '@react-aria/interactions';
import { useFocusRing } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';

import { useDOMRef } from '../../hooks';
import { InputSizes } from '../../theme';
import { TextProps } from '../Text';
import { Flex } from '../Flex';
import { Label, LabelProps } from '../Label';

import { StyledChevronDown, StyledTrigger, StyledTriggerValue } from './Select.style';

type Props = {
  as?: any;
  size?: InputSizes;
  isOpen?: boolean;
  hasError?: boolean;
  placeholder?: ReactNode;
  valueProps?: TextProps<unknown>;
  label?: ReactNode;
  labelProps?: LabelProps;
  onPress?: (e: PressEvent) => void;
};

type NativeAttrs = Omit<ButtonHTMLAttributes<unknown>, keyof Props>;

type SelectTriggerProps = Props & NativeAttrs;

// MEMO: this is prune to change when `Select` is added
const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  (
    {
      as,
      size = 'md',
      hasError = false,
      isOpen,
      children,
      valueProps,
      placeholder = 'Select an option',
      name,
      autoFocus,
      label,
      labelProps,
      ...props
    },
    ref
  ): JSX.Element => {
    const { disabled } = props;

    const buttonRef = useDOMRef(ref);

    const { buttonProps } = useButton({ ...props, isDisabled: disabled }, buttonRef);

    const { hoverProps, isHovered } = useHover({ isDisabled: disabled });

    const { isFocused, focusProps } = useFocusRing({
      autoFocus
    });

    const Comp = as || StyledTrigger;

    return (
      <Comp
        {...mergeProps(buttonProps, hoverProps, focusProps)}
        ref={buttonRef}
        $hasError={hasError}
        $hasValue={!!children}
        $isDisabled={!!disabled}
        $isFocused={isFocused}
        $isHovered={isHovered}
        $isOpen={isOpen}
        $size={size}
        data-invalid={hasError ? true : null}
        name={name}
      >
        <Flex direction='column' style={{ flex: 1, width: '100%' }}>
          {label && (
            <Label error={hasError} size={size} {...labelProps}>
              {label}
            </Label>
          )}
          <StyledTriggerValue {...valueProps} $isDisabled={disabled} $isSelected={!!children}>
            {children || placeholder}
          </StyledTriggerValue>
        </Flex>
        <StyledChevronDown color='inherit' size='xs' />
      </Comp>
    );
  }
);

SelectTrigger.displayName = 'SelectTrigger';

export { SelectTrigger };
export type { SelectTriggerProps };
