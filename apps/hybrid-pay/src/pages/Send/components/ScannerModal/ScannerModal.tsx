import { Modal, ModalBody, ModalHeader, ModalProps } from '@gobob/ui';
// @ts-ignore
import { Scanner } from '@yudiel/react-qr-scanner';

type IDetectedBarcode = {
  rawValue: string;
};

type Props = { onScan: (detectedCodes: IDetectedBarcode[]) => void };

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type ScannerModal = Props & InheritAttrs;

const ScannerModal = ({ onScan, ...props }: ScannerModal): JSX.Element => {
  return (
    <Modal {...props}>
      <ModalHeader>Scan QR Code</ModalHeader>
      <ModalBody>
        <Scanner onScan={onScan} />
      </ModalBody>
    </Modal>
  );
};

export { ScannerModal };