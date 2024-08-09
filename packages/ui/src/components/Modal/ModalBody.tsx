import { DialogBodyProps } from '../Dialog';

import { StyledDialogBody } from './Modal.style';

type Props = {};

type InheritAttrs = Omit<DialogBodyProps, keyof Props>;

type ModalBodyProps = Props & InheritAttrs;

const ModalBody = (props: ModalBodyProps): JSX.Element => <StyledDialogBody {...props} />;

export { ModalBody };
export type { ModalBodyProps };
