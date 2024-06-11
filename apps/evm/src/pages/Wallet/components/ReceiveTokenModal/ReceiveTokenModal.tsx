import {
  Button,
  Card,
  DocumentDuplicate,
  InformationCircle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
  P
} from '@gobob/ui';
import { BITCOIN } from '@gobob/tokens';
import QRCode from 'react-qr-code';
import { useAccount } from '@gobob/wagmi';
import { useAccount as useSatsWagmi } from '@gobob/sats-wagmi';
import { useCopyToClipboard } from '@uidotdev/usehooks';

import { TokenData } from '../../../../hooks';

type Props = {
  token: TokenData | 'btc';
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type ReceiveTokenModalProps = Props & InheritAttrs;

const ReceiveTokenModal = ({ token, onClose, ...props }: ReceiveTokenModalProps): JSX.Element => {
  const { address: evmAddress } = useAccount();
  const { address: btcAddress } = useSatsWagmi();
  const [, copy] = useCopyToClipboard();

  const address = (token === 'btc' ? btcAddress : evmAddress) || '';

  const currency = token !== 'btc' ? token.currency : BITCOIN;

  return (
    <Modal elementType='form' onClose={onClose} {...props}>
      <ModalHeader align='start'>Send {currency.symbol}</ModalHeader>
      <ModalBody gap='2xl'>
        {token !== 'btc' && (
          <Card
            alignItems='center'
            background='red-900'
            bordered='red-500'
            direction='row'
            gap='md'
            padding='md'
            role='alert'
          >
            <InformationCircle color='red-500' />
            <P size='xs'>Ensure that you are transferring from the BOB Network to avoid any loss of funds.</P>
          </Card>
        )}
        <Card background='grey-800' gap='2xl' padding='4xl'>
          <QRCode
            bgColor='transparent'
            fgColor='#ffffff'
            size={256}
            style={{ height: 'auto', maxWidth: '100%', width: '100%', background: 'transparent' }}
            value={address}
            viewBox={`0 0 256 256`}
          />
          <P align='center' size='xs'>
            {address}
          </P>
        </Card>
      </ModalBody>
      <ModalFooter wrap direction='row' gap='lg'>
        <Button fullWidth size='lg' style={{ flex: 1 }} variant='ghost' onPress={onClose}>
          Cancel
        </Button>
        <Button
          fullWidth
          color='primary'
          size='lg'
          style={{ flex: 1, whiteSpace: 'nowrap' }}
          onPress={() => copy(address)}
        >
          <DocumentDuplicate size='s' style={{ marginRight: '.25rem' }} />
          Copy Address
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { ReceiveTokenModal };
