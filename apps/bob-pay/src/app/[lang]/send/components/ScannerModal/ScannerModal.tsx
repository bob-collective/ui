import { Modal, ModalBody, ModalHeader, ModalProps } from '@gobob/ui';
import { Trans } from '@lingui/macro';
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
      <ModalHeader>
        <Trans>Scan QR Code</Trans>
      </ModalHeader>
      <ModalBody marginBottom='lg'>
        <Scanner onScan={onScan} />
      </ModalBody>
    </Modal>
  );
};

export { ScannerModal };
