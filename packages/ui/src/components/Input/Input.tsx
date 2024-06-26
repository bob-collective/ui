import { AriaTextFieldOptions, useTextField } from '@react-aria/textfield';
import { mergeProps } from '@react-aria/utils';
import { forwardRef } from 'react';

import { useDOMRef } from '../../hooks';

import { BaseInput, BaseInputProps } from './BaseInput';

type Props = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type InheritAttrs = Omit<
  BaseInputProps,
  keyof Props | 'errorMessageProps' | 'descriptionProps' | 'inputProps' | 'elementType'
>;

type AriaAttrs = Omit<AriaTextFieldOptions<'input'>, (keyof Props & InheritAttrs) | 'onChange'>;

type InputProps = Props & InheritAttrs & AriaAttrs;

const elementType = 'input';

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ isInvalid, onValueChange, onChange, ...props }, ref): JSX.Element => {
    const inputRef = useDOMRef(ref);
    // We are specifing `validationState` so that when there are errors, `aria-invalid` is set to `true`
    const { inputProps, descriptionProps, errorMessageProps, labelProps } = useTextField(
      {
        ...props,
        isInvalid: isInvalid || !!props.errorMessage,
        inputElementType: elementType,
        onChange: onValueChange
      },
      inputRef
    );

    return (
      <BaseInput
        ref={inputRef}
        descriptionProps={descriptionProps}
        elementType={elementType}
        errorMessageProps={errorMessageProps}
        inputProps={mergeProps(inputProps, { onChange })}
        labelProps={labelProps}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
