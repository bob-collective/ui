import { forwardRef, HTMLAttributes, ReactNode } from 'react';

import { StyledHelperText, StyledSubHelperText } from './HelperText.style';

type Props = {
  errorMessage?: ReactNode | ReactNode[];
  // Used to pass accessiblity props
  errorMessageProps?: HTMLAttributes<HTMLElement>;
  description?: ReactNode;
  // Used to pass accessiblity props
  descriptionProps?: HTMLAttributes<HTMLElement>;
};

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type HelperTextProps = Props & NativeAttrs;

const HelperText = forwardRef<HTMLDivElement, HelperTextProps>(
  ({ errorMessage, errorMessageProps, description, descriptionProps, ...props }, ref): JSX.Element => {
    const renderErrorMessage = () => {
      if (Array.isArray(errorMessage)) {
        return errorMessage.map((message, idx) => <StyledSubHelperText key={idx}>{message}</StyledSubHelperText>);
      }

      return errorMessage;
    };

    return (
      <StyledHelperText {...props} ref={ref} $hasError={!!errorMessage}>
        {!!errorMessage ? (
          <div {...errorMessageProps}>{renderErrorMessage()}</div>
        ) : (
          <div {...descriptionProps}>{description}</div>
        )}
      </StyledHelperText>
    );
  }
);

HelperText.displayName = 'HelperText';

export { HelperText };
export type { HelperTextProps };
