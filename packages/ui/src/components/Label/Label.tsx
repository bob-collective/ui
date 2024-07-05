import { forwardRef, LabelHTMLAttributes } from 'react';

import { LabelSizes } from '../../theme';

import { StyledLabel } from './Label.style';

type Props = {
  size?: LabelSizes;
  error?: boolean;
};

type NativeAttrs = Omit<LabelHTMLAttributes<unknown>, keyof Props>;

type LabelProps = Props & NativeAttrs;

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, size = 'md', error, ...props }, ref): JSX.Element => (
    <StyledLabel {...props} ref={ref} $error={error} $size={size} as='label'>
      {children}
    </StyledLabel>
  )
);

Label.displayName = 'Label';

export { Label };
export type { LabelProps };
