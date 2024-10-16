import { DividerProps } from '../Divider';

import { StyledDivider } from './Dialog.style';

type DialogDividerProps = DividerProps;

const DialogDivider = (props: DialogDividerProps): JSX.Element => {
  return <StyledDivider {...props} />;
};

export { DialogDivider };
export type { DialogDividerProps };
