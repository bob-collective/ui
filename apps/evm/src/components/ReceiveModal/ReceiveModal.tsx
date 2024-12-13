import {
  ArrowLeft,
  Button,
  Card,
  Flex,
  Modal,
  ModalBody,
  ModalHeader,
  P,
  QrCode,
  Span,
  UnstyledButton
} from '@gobob/ui';
import QRCode from 'react-qr-code';
import { useAccount } from 'wagmi';
import { Trans } from '@lingui/macro';
import { useState } from 'react';
import { useStore } from '@tanstack/react-store';
import { truncateBtcAddress, truncateEthAddress } from '@gobob/utils';
import { BTC, ETH } from '@gobob/icons';
import { WalletIcon } from '@dynamic-labs/wallet-book';
import { ChainId } from '@gobob/chains';

import { Chain } from '../Chain';
import { ChainAsset } from '../ChainAsset/ChainAsset';
import { CopyButton } from '../CopyButton';
import { CopyAddress } from '../CopyAddress';

import { useBtcAccount, useDynamicWallets } from '@/hooks';
import { L1_CHAIN, L2_CHAIN } from '@/constants';
import { store } from '@/lib/store';

enum ReceiveSteps {
  Main = 'main',
  EVM = 'evm',
  BTC = 'btc'
}

const ReceiveModal = (): JSX.Element => {
  const isReceiveModalOpen = useStore(store, (state) => state.shared.isReceiveModalOpen);

  const [step, setStep] = useState(ReceiveSteps.Main);
  const { evmWallet } = useDynamicWallets();
  const { address: evmAddress } = useAccount();
  const { address: btcAddress, connector: btcConnector } = useBtcAccount();

  const address = (step === ReceiveSteps.EVM ? evmAddress : btcAddress) || '';

  const shortAddress =
    step === ReceiveSteps.EVM
      ? truncateEthAddress(evmAddress || '')
      : btcAddress
        ? truncateBtcAddress(btcAddress)
        : undefined;

  const handleClose = () => {
    setStep(ReceiveSteps.Main);
    store.setState((state) => ({
      ...state,
      shared: {
        ...state.shared,
        isReceiveModalOpen: false
      }
    }));
  };

  return (
    <Modal elementType='form' isOpen={isReceiveModalOpen} onClose={handleClose}>
      <ModalHeader align='start' showDivider={false}>
        {step === ReceiveSteps.Main ? (
          <Trans>Receive crypto</Trans>
        ) : (
          <UnstyledButton onPress={() => setStep(ReceiveSteps.Main)}>
            <Flex alignItems='center' elementType='span' gap='s'>
              <ArrowLeft size='s' />
              <Span>
                <Trans>Back</Trans>
              </Span>
            </Flex>
          </UnstyledButton>
        )}
      </ModalHeader>
      <ModalBody gap='2xl' padding='even'>
        {step === ReceiveSteps.Main && (
          <Flex direction='column' gap='md'>
            <P size='s'>
              <Trans>Fund your wallet(s) by transferring crypto from another wallet or account.</Trans>
            </P>
            <Flex direction='column' gap='md' paddingX='md'>
              {evmAddress && (
                <Card
                  alignItems='center'
                  background='grey-600'
                  direction='row'
                  flex={1}
                  gap='md'
                  justifyContent='space-between'
                  padding='md'
                >
                  <Flex alignItems='center' gap='lg'>
                    <ChainAsset
                      asset={<ETH size='xl' />}
                      chainId={ChainId.ETHEREUM}
                      chainLogo={
                        evmWallet && (
                          <WalletIcon style={{ height: '1rem', width: '1rem' }} walletKey={evmWallet.connector.key} />
                        )
                      }
                    />
                    <Span size='s' weight='semibold'>
                      {truncateEthAddress(evmAddress)}
                    </Span>
                  </Flex>
                  <Flex>
                    <CopyButton
                      isIconOnly
                      iconProps={{ color: 'grey-50', size: 's' }}
                      size='s'
                      value={evmAddress}
                      variant='ghost'
                    />
                    <Button isIconOnly size='s' variant='ghost' onPress={() => setStep(ReceiveSteps.EVM)}>
                      <QrCode color='grey-50' />
                    </Button>
                  </Flex>
                </Card>
              )}
              {btcAddress && (
                <Card
                  alignItems='center'
                  background='grey-600'
                  direction='row'
                  flex={1}
                  gap='md'
                  justifyContent='space-between'
                  padding='md'
                >
                  <Flex alignItems='center' gap='lg'>
                    <ChainAsset
                      asset={<BTC size='xl' />}
                      chainId={ChainId.ETHEREUM}
                      chainLogo={
                        btcConnector && (
                          <WalletIcon style={{ height: '1rem', width: '1rem' }} walletKey={btcConnector.key} />
                        )
                      }
                    />
                    <Span size='s' weight='semibold'>
                      {truncateBtcAddress(btcAddress)}
                    </Span>
                  </Flex>
                  <Flex>
                    <CopyButton
                      isIconOnly
                      iconProps={{ color: 'grey-50', size: 's' }}
                      size='s'
                      value={btcAddress}
                      variant='ghost'
                    />

                    <Button isIconOnly size='s' variant='ghost' onPress={() => setStep(ReceiveSteps.BTC)}>
                      <QrCode color='grey-50' />
                    </Button>
                  </Flex>
                </Card>
              )}
            </Flex>
          </Flex>
        )}
        {step !== ReceiveSteps.Main && (
          <>
            <CopyAddress
              address={address}
              align='center'
              iconVisibility='hover'
              style={{ flex: 1 }}
              truncatedAddress={shortAddress}
              weight='semibold'
            />
            <Card background='grey-800' gap='2xl' marginX='3xl' padding='2xl'>
              <QRCode
                bgColor='transparent'
                fgColor='#ffffff'
                size={256}
                style={{ height: 'auto', maxWidth: '100%', width: '100%', background: 'transparent' }}
                value={address}
                viewBox='0 0 256 256'
              />
            </Card>
            {step === ReceiveSteps.EVM && (
              <Flex direction='column' gap='md' justifyContent='center'>
                <P align='center' color='grey-50' size='s'>
                  <Trans>You can receive tokens on our supported networks</Trans>
                </P>
                <Flex gap='md' justifyContent='center'>
                  <Chain chainId={L1_CHAIN} labelProps={{ size: 's' }} />
                  <Chain chainId={L2_CHAIN} labelProps={{ size: 's' }} />
                </Flex>
              </Flex>
            )}
          </>
        )}
      </ModalBody>
    </Modal>
  );
};

export { ReceiveModal };
