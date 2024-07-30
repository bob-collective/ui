import { AriaRadioGroupProps, useRadioGroup } from '@react-aria/radio';
import { ChangeEvent, forwardRef } from 'react';
import { useRadioGroupState } from '@react-stately/radio';

import { useDOMRef } from '../../hooks';
import { Orientation, RadioSize, Spacing } from '../../theme';
import { Label } from '../Label';
import { HelperText, HelperTextProps } from '../HelperText';

import { RadioContext } from './RadioContext';
import { StyledField, StyledRadioGroup } from './Radio.style';

type Props = {
  gap?: Spacing;
  orientation?: Orientation;
  size?: RadioSize;
  onChange?: (e: ChangeEvent<HTMLDivElement>) => void;
  onValueChange?: (value: string) => void;
};

type AriaAttrs = Omit<AriaRadioGroupProps, keyof Props | 'errorMessage' | 'description'>;

type InheritAttrs = Omit<HelperTextProps, keyof (Props & AriaAttrs)>;

type RadioGroupProps = Props & InheritAttrs & AriaAttrs;

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      orientation = 'vertical',
      children,
      onValueChange,
      onChange,
      gap,
      size = 'md',
      label,
      errorMessage,
      description,
      isInvalid,
      isDisabled,
      ...props
    },
    ref
  ): JSX.Element => {
    let domRef = useDOMRef(ref);
    let state = useRadioGroupState({
      onChange: onValueChange,
      errorMessage,
      description,
      isInvalid: !!errorMessage || isInvalid,
      isDisabled,
      ...props
    });
    let { radioGroupProps, labelProps, descriptionProps, errorMessageProps } = useRadioGroup(
      { label, errorMessage, description, isDisabled, isInvalid, ...props },
      state
    );

    return (
      <StyledField ref={domRef} $isDisabled={isDisabled} direction='column'>
        {label && (
          <Label error={!!errorMessage} size={size} {...labelProps}>
            {label}
          </Label>
        )}
        <StyledRadioGroup
          {...radioGroupProps}
          $gap={orientation === 'horizontal' ? gap || 'md' : gap}
          $orientation={orientation}
          direction={orientation === 'vertical' ? 'column' : 'row'}
          onChange={onChange}
        >
          <RadioContext.Provider value={{ state, size }}>{children}</RadioContext.Provider>
        </StyledRadioGroup>
        {(description || errorMessage) && (
          <HelperText
            description={description}
            descriptionProps={descriptionProps}
            errorMessage={errorMessage}
            errorMessageProps={errorMessageProps}
          />
        )}
      </StyledField>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export { RadioGroup };
export type { RadioGroupProps };
