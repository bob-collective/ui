import { useHover, usePress } from '@react-aria/interactions';
import { AriaRadioProps, useRadio } from '@react-aria/radio';
import { HTMLAttributes, forwardRef, useRef } from 'react';
import { useTheme } from 'styled-components';
import { mergeProps } from '@react-aria/utils';
import { useFocusRing } from '@react-aria/focus';

import { useDOMRef } from '../../hooks';
import { Span } from '../Text';
import { LabelProps } from '../Label';

import { StyledButton, StyledInput, StyledLabel } from './Radio.style';
import { useRadioProvider } from './RadioContext';

type Props = {
  labelProps?: LabelProps;
  flex?: string | number | boolean;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type InheritAttrs = Omit<AriaRadioProps, keyof Props>;

type RadioProps = Props & NativeAttrs & InheritAttrs;

const Radio = forwardRef<HTMLLabelElement, RadioProps>(
  ({ labelProps, isDisabled: isDisabledProp, children, className, style, flex, ...props }, ref): JSX.Element => {
    const { hoverProps, isHovered } = useHover({ isDisabled: isDisabledProp });
    const { pressProps, isPressed } = usePress({ isDisabled: isDisabledProp, ...props });
    const { isFocusVisible, isFocused, focusProps } = useFocusRing(props);

    const { radio } = useTheme();

    const labelRef = useDOMRef(ref);
    const inputRef = useRef<HTMLInputElement>(null);

    const { size, state } = useRadioProvider();

    const { inputProps, isSelected, isDisabled } = useRadio(
      {
        ...props,
        children,
        isDisabled: isDisabledProp
      },
      state,
      inputRef
    );

    return (
      <StyledLabel
        {...mergeProps(labelProps, hoverProps, pressProps)}
        ref={labelRef}
        $flex={flex}
        $isDisabled={isDisabled}
        className={className}
        data-disabled={isDisabledProp || undefined}
        data-focus={isFocused || undefined}
        data-focus-visible={isFocusVisible || undefined}
        data-hover={isHovered || undefined}
        data-invalid={state.isInvalid || undefined}
        data-pressed={isPressed || undefined}
        data-selected={isSelected || undefined}
        error={state.isInvalid}
        style={style}
      >
        <StyledInput {...mergeProps(inputProps, focusProps)} ref={inputRef} />
        <StyledButton $isHovered={isHovered} $isInvalid={state.isInvalid} $isSelected={isSelected} $size={size} />
        {children && (
          <Span color='inherit' size={radio.size[size].label}>
            {children}
          </Span>
        )}
      </StyledLabel>
    );
  }
);

Radio.displayName = 'Radio';

export { Radio };
export type { RadioProps };
