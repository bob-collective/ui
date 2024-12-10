import { Card, Flex, Modal, ModalBody, ModalHeader, ModalProps, P } from '@gobob/ui';
import QRCode from 'react-qr-code';
import { useAccount } from 'wagmi';
import { useCopyToClipboard } from 'usehooks-ts';
import { Trans } from '@lingui/macro';
import { useState } from 'react';

import { Chain } from '../Chain';

import { useBtcAccount } from '@/hooks';
import { L1_CHAIN, L2_CHAIN } from '@/constants';

enum ReceiveSteps {
  Main = 'main',
  EVM = 'evm',
  BTC = 'btc'
}

type ReceiveModalProps = Omit<ModalProps, 'children'>;

const ReceiveModal = ({ onClose, ...props }: ReceiveModalProps): JSX.Element => {
  const [step, setStep] = useState(ReceiveSteps.Main);

  const { address: evmAddress } = useAccount();
  const { address: btcAddress } = useBtcAccount();
  const [, copy] = useCopyToClipboard();

  const address = (step === ReceiveSteps.EVM ? evmAddress : btcAddress) || '';

  return (
    <Modal elementType='form' onClose={onClose} {...props}>
      <ModalHeader align='start'>Receive crypto</ModalHeader>
      <ModalBody gap='2xl'>
        {step === ReceiveSteps.Main && (
          <Flex direction='column'>
            <P>
              <Trans>Fund your wallet(s) by transferring crypto from another wallet or account.</Trans>
            </P>
            {evmAddress && (
              <Card isHoverable isPressable onPress={() => setStep(ReceiveSteps.EVM)}>
                EVM
              </Card>
            )}
            {btcAddress && (
              <Card isHoverable isPressable onPress={() => setStep(ReceiveSteps.BTC)}>
                BTC
              </Card>
            )}
          </Flex>
        )}
        {/* {token !== 'btc' && (
          <Card
            alignItems='center'
            background='red-900'
            borderColor='red-500'
            direction='row'
            gap='md'
            padding='md'
            role='alert'
          >
            <InformationCircle color='red-500' />
            <P size='xs'>Ensure that you are transferring from the BOB Network to avoid any loss of funds.</P>
          </Card>
        )} */}
        {step !== ReceiveSteps.Main && (
          <>
            <P align='center' size='xs'>
              {address}
            </P>
            <Card background='grey-800' gap='2xl' padding='4xl'>
              <QRCode
                bgColor='transparent'
                fgColor='#ffffff'
                size={256}
                style={{ height: 'auto', maxWidth: '100%', width: '100%', background: 'transparent' }}
                value={address}
                viewBox={`0 0 256 256`}
              />
            </Card>
          </>
        )}
        {step === ReceiveSteps.EVM && (
          <Flex direction='column'>
            <P>You can receive tokens on our supportred networks</P>
            <Flex>
              <Chain chainId={L1_CHAIN} />
              <Chain chainId={L2_CHAIN} />
            </Flex>
          </Flex>
        )}
      </ModalBody>
    </Modal>
  );
};

export { ReceiveModal };
