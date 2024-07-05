import { forwardRef, LabelHTMLAttributes } from 'react';

import { LabelPosition, LabelSizes } from '../../theme';

import { StyledLabel } from './Label.style';

type Props = {
  position?: LabelPosition;
  size?: LabelSizes;
  error?: boolean;
};

type NativeAttrs = Omit<LabelHTMLAttributes<unknown>, keyof Props>;

type LabelProps = Props & NativeAttrs;

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, position = 'inside', size = 'md', error, ...props }, ref): JSX.Element => (
    <StyledLabel {...props} ref={ref} $error={error} $position={position} $size={size} as='label'>
      {children}
    </StyledLabel>
  )
);

Label.displayName = 'Label';

export { Label };
export type { LabelProps };
