import { FocusEvent, forwardRef, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { useHover } from '@react-aria/interactions';
import { useFocusRing } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';

import { useDOMRef } from '../../hooks';
import { Spacing, InputSizes } from '../../theme';
import { Field, FieldProps, useFieldProps } from '../Field';
import { HelperTextProps } from '../HelperText';
import { LabelProps } from '../Label';
import { hasError } from '../utils/input';
import { ElementTypeProp } from '../utils/types';

import { StyledAdornmentLeft, StyledAdornmentRight, StyledBaseInput, StyledWrapper } from './Input.style';

// TODO: might need to consolidate this later
interface HTMLInputProps extends ElementTypeProp {
  elementType?: 'input';
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface HTMLTextAreaProps extends ElementTypeProp {
  elementType?: 'textarea';
  inputProps: TextareaHTMLAttributes<HTMLTextAreaElement>;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

type Props = {
  label?: ReactNode;
  labelProps?: LabelProps;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  value?: string | ReadonlyArray<string> | number;
  defaultValue?: string | ReadonlyArray<string> | number;
  size?: InputSizes;
  isInvalid?: boolean;
  minHeight?: Spacing;
  onFocus?: (e: FocusEvent<Element>) => void;
  onBlur?: (e: FocusEvent<Element>) => void;
} & (HTMLInputProps | HTMLTextAreaProps);

type InheritAttrs = Omit<
  HelperTextProps &
    Pick<FieldProps, 'label' | 'labelPosition' | 'labelProps' | 'maxWidth' | 'justifyContent' | 'alignItems'>,
  keyof Props
>;

type BaseInputProps = Props & InheritAttrs;

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  (
    { startAdornment, endAdornment, size = 'md', isInvalid, inputProps, minHeight, elementType = 'input', ...props },
    ref
  ): JSX.Element => {
    const domRef = useDOMRef(ref);
    // FIXME: move this into Field
    const { fieldProps } = useFieldProps(props);

    const error = hasError({ isInvalid, errorMessage: props.errorMessage });

    const isDisabled = !!inputProps?.disabled;

    const { hoverProps, isHovered } = useHover({ isDisabled });

    const { isFocused, focusProps } = useFocusRing({
      autoFocus: inputProps.autoFocus,
      isTextInput: true
    });

    return (
      <Field size={size} {...fieldProps}>
        <StyledWrapper
          $error={error}
          $isDisabled={isDisabled}
          $isFocused={isFocused}
          $isHovered={isHovered}
          $size={size}
          onClick={(e) => {
            if (domRef.current && e.currentTarget === e.target) {
              domRef.current.focus();
            }
          }}
          {...mergeProps(hoverProps, focusProps)}
        >
          {startAdornment && <StyledAdornmentLeft $size={size}>{startAdornment}</StyledAdornmentLeft>}
          <StyledBaseInput
            ref={domRef as any}
            $error={error}
            $minHeight={minHeight}
            as={elementType}
            {...mergeProps(inputProps, focusProps)}
          />
          {endAdornment && <StyledAdornmentRight $size={size}>{endAdornment}</StyledAdornmentRight>}
        </StyledWrapper>
      </Field>
    );
  }
);

BaseInput.displayName = 'BaseInput';

export { BaseInput };
export type { BaseInputProps };
