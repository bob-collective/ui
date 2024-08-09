import { Spacing } from '../../theme';
import { FlexProps } from '../Flex';

import { StyledDialogBody } from './Dialog.style';

type Props = {
  maxHeight?: Spacing;
  padding?: 'even' | 'uneven' | 'none';
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type DialogBodyProps = Props & InheritAttrs;

const DialogBody = ({
  direction = 'column',
  maxHeight,
  padding = 'uneven',
  ...props
}: DialogBodyProps): JSX.Element => {
  return <StyledDialogBody {...props} $maxHeight={maxHeight} $padding={padding} direction={direction} />;
};

export { DialogBody };
export type { DialogBodyProps };
