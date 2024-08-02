import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { CSSProperties } from 'styled-components';

import { LabelPosition } from '../../theme';
import { Flex, FlexProps } from '../Flex';
import { HelperText, HelperTextProps } from '../HelperText';
import { LabelProps } from '../Label';
import { hasError } from '../utils/input';

import { StyledField, StyledFieldElWrapper, StyledLabel } from './Field.style';

type Props = {
  label?: ReactNode;
  labelPosition?: LabelPosition;
  labelProps?: LabelProps;
  maxWidth?: CSSProperties['maxWidth'];
  fullWidth?: boolean;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type InheritAttrs = Omit<HelperTextProps & FlexProps, keyof Props & NativeAttrs>;

type FieldProps = Props & NativeAttrs & InheritAttrs;

const Field = forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      label,
      labelPosition = 'inside',
      labelProps,
      errorMessage,
      errorMessageProps,
      description,
      descriptionProps,
      children,
      maxWidth,
      fullWidth,
      ...props
    },
    ref
  ): JSX.Element => {
    const error = hasError({ errorMessage });
    const hasHelpText = !!description || error;

    const element = (
      <>
        <StyledFieldElWrapper>{children}</StyledFieldElWrapper>
        {hasHelpText && (
          <HelperText
            description={description}
            descriptionProps={descriptionProps}
            errorMessage={errorMessage}
            errorMessageProps={errorMessageProps}
          />
        )}
      </>
    );

    return (
      <StyledField
        ref={ref}
        $fullWidth={fullWidth}
        $maxWidth={maxWidth}
        direction={labelPosition === 'outside-left' ? 'row' : 'column'}
        {...props}
      >
        {label && (
          <StyledLabel {...labelProps} position={labelPosition}>
            {label}
          </StyledLabel>
        )}
        {labelPosition === 'outside-left' ? (
          <Flex alignItems='flex-end' direction='column'>
            {element}
          </Flex>
        ) : (
          element
        )}
      </StyledField>
    );
  }
);

Field.displayName = 'Field';

const useFieldProps = ({
  label,
  labelPosition,
  labelProps,
  errorMessage,
  errorMessageProps,
  description,
  descriptionProps,
  className,
  hidden,
  style,
  maxWidth,
  alignItems,
  justifyContent,
  gap,
  fullWidth,
  ...props
}: FieldProps): { fieldProps: FieldProps; elementProps: any } => {
  return {
    fieldProps: {
      label,
      labelPosition,
      labelProps,
      errorMessage,
      errorMessageProps,
      description,
      descriptionProps,
      className,
      hidden,
      style,
      maxWidth,
      alignItems,
      justifyContent,
      gap,
      fullWidth
    },
    elementProps: props
  };
};

export { Field, useFieldProps };
export type { FieldProps };
