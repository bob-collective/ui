'use client';

import { useFocusRing } from '@react-aria/focus';
import { usePress } from '@react-aria/interactions';
import { AriaSwitchProps, useSwitch } from '@react-aria/switch';
import { mergeProps } from '@react-aria/utils';
import { useToggleState } from '@react-stately/toggle';
import { PressEvent } from '@react-types/shared';
import { ChangeEvent, forwardRef, HTMLAttributes, useRef } from 'react';

import { useDOMRef } from '../../hooks';
import { Placement, SwitchSize } from '../../theme';
import { TextProps } from '../Text';

import { StyledInput, StyledLabel, StyledSwitch, StyledWrapper } from './Switch.style';

type Props = {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onPress?: (e: PressEvent) => void;
  labelProps?: TextProps;
  labelPlacement?: Extract<Placement, 'left' | 'right'>;
  size?: SwitchSize;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type InheritAttrs = Omit<AriaSwitchProps, keyof Props>;

type SwitchProps = Props & NativeAttrs & InheritAttrs;

const Switch = forwardRef<HTMLLabelElement, SwitchProps>(
  (
    { children, onChange, className, style, hidden, labelProps, labelPlacement, size = 'md', isSelected, ...props },
    ref
  ): JSX.Element => {
    const labelRef = useDOMRef(ref);
    const inputRef = useRef<HTMLInputElement>(null);

    const ariaProps: AriaSwitchProps = { children, isSelected, ...props };

    const state = useToggleState(ariaProps);
    const { inputProps } = useSwitch(ariaProps, state, inputRef);

    const { focusProps, isFocusVisible } = useFocusRing({
      autoFocus: inputProps.autoFocus
    });

    const { pressProps } = usePress(props);

    return (
      <StyledWrapper
        ref={labelRef}
        $reverse={labelPlacement === 'left'}
        className={className}
        hidden={hidden}
        style={style}
      >
        <StyledInput {...mergeProps(inputProps, focusProps, pressProps, { onChange })} ref={inputRef} />
        <StyledSwitch $isChecked={inputProps.checked} $isFocusVisible={isFocusVisible} $size={size} />
        {children && <StyledLabel {...labelProps}>{children}</StyledLabel>}
      </StyledWrapper>
    );
  }
);

Switch.displayName = 'Switch';

export { Switch };
export type { SwitchProps };
