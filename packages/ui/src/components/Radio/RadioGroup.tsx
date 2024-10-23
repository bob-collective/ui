import { AriaRadioGroupProps, useRadioGroup } from '@react-aria/radio';
import { ChangeEvent, forwardRef } from 'react';
import { useRadioGroupState } from '@react-stately/radio';

import { useDOMRef, useStyleProps } from '../../hooks';
import { MarginProps, Orientation, PaddingProps, RadioSize, Spacing } from '../../theme';
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

type RadioGroupProps = Props & InheritAttrs & AriaAttrs & MarginProps & PaddingProps;

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
    const { styleProps, componentProps } = useStyleProps(props);

    let domRef = useDOMRef(ref);
    let state = useRadioGroupState({
      onChange: onValueChange,
      errorMessage,
      description,
      isInvalid: !!errorMessage || isInvalid,
      isDisabled,
      ...componentProps
    });
    let { radioGroupProps, labelProps, descriptionProps, errorMessageProps } = useRadioGroup(
      { label, errorMessage, description, isDisabled, isInvalid, ...componentProps },
      state
    );

    return (
      <StyledField ref={domRef} $isDisabled={isDisabled} direction='column' styleProps={styleProps}>
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
