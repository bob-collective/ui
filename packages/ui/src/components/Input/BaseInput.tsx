import {
  FocusEvent,
  forwardRef,
  InputHTMLAttributes,
  MouseEventHandler,
  ReactNode,
  TextareaHTMLAttributes
} from 'react';
import { useHover } from '@react-aria/interactions';
import { useFocusRing } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';

import { useDOMRef } from '../../hooks';
import { Spacing, InputSizes } from '../../theme';
import { HelperText, HelperTextProps } from '../HelperText';
import { Label, LabelProps } from '../Label';
import { hasError } from '../utils/input';
import { ElementTypeProp } from '../utils/types';
import { Flex } from '../Flex';

import { StyledAdornment, StyledBaseInput, StyledField, StyledWrapper } from './Input.style';

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

type InheritAttrs = Omit<HelperTextProps, keyof Props>;

type BaseInputProps = Props & InheritAttrs;

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  (
    {
      startAdornment,
      endAdornment,
      size = 'md',
      isInvalid,
      inputProps,
      minHeight,
      elementType = 'input',
      label,
      labelProps,
      description,
      descriptionProps,
      errorMessage,
      errorMessageProps,
      className,
      hidden,
      style
    },
    ref
  ): JSX.Element => {
    const domRef = useDOMRef(ref);

    const error = hasError({ isInvalid, errorMessage: errorMessage });

    const isDisabled = !!inputProps?.disabled;

    const { hoverProps, isHovered } = useHover({ isDisabled });

    const { isFocused, focusProps } = useFocusRing({
      autoFocus: inputProps.autoFocus,
      isTextInput: true
    });

    const hasHelpText = !!description || error;

    const handleClickWrapper: MouseEventHandler<unknown> = (e) => {
      if (domRef.current && e.currentTarget === e.target) {
        domRef.current.focus();
      }
    };

    return (
      <StyledField $disabled={isDisabled} className={className} direction='column' hidden={hidden} style={style}>
        <StyledWrapper
          $error={error}
          $isFocused={isFocused}
          $isHovered={isHovered}
          $isTextArea={elementType === 'textarea'}
          $size={size}
          direction='column'
          onClick={handleClickWrapper}
          {...mergeProps(hoverProps, focusProps)}
        >
          {label && (
            <Label error={error} size={size} {...labelProps}>
              {label}
            </Label>
          )}
          <Flex>
            {startAdornment && <StyledAdornment $size={size}>{startAdornment}</StyledAdornment>}
            <StyledBaseInput
              ref={domRef as any}
              $error={error}
              $hasEndAdornment={!!endAdornment}
              $hasStartAdornment={!!startAdornment}
              $minHeight={minHeight}
              as={elementType}
              {...mergeProps(inputProps, focusProps)}
            />
            {endAdornment && <StyledAdornment $size={size}>{endAdornment}</StyledAdornment>}
          </Flex>
        </StyledWrapper>
        {hasHelpText && (
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

BaseInput.displayName = 'BaseInput';

export { BaseInput };
export type { BaseInputProps };
