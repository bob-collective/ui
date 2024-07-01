'use client';
import { Button, Flex, Modal, ModalBody, ModalFooter, ModalHeader, ModalProps, P, toast, ArrowLeft } from '@gobob/ui';
import { Address, Connector, useAccount, useAccountEffect, useConnect, useDisconnect } from '@gobob/wagmi';
import {
  useAccount as useSatsAccount,
  useDisconnect as useSatsDisconnect,
  useConnect as useSatsConnect,
  SatsConnector
} from '@gobob/sats-wagmi';
import { forwardRef, useCallback, useState } from 'react';

import { ConnectType, WalletType } from '../../types';

import { WalletList } from './WalletList';
import { ConnectedWalletSection } from './ConnectedWalletSection';
import { ConnectWalletCard } from './ConnectWalletCard';

type ConnectEvmHandler = ({ address }: { address?: Address; connector?: Connector; isReconnected: boolean }) => void;

type ConnectBtcHandler = ({ address }: { address?: string }) => void;

type Props = {
  step?: WalletType;
  type?: ConnectType;
  onConnectEvm?: ConnectEvmHandler;
  onConnectBtc?: ConnectBtcHandler;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type ConnectModalProps = Props & InheritAttrs;

const ConnectModal = forwardRef<HTMLDivElement, ConnectModalProps>(
  ({ onClose, isOpen, step: stepProp, type = 'both', onConnectEvm, onConnectBtc, ...props }, ref) => {
    const { connector, address } = useAccount();
    const { disconnect } = useDisconnect();
    const { connectors, connectAsync } = useConnect();
    const [step, setStep] = useState<WalletType | undefined>(stepProp);

    const { address: btcWalletAddress, connector: btcWalletConnector } = useSatsAccount({ onConnect: onConnectBtc });
    const { disconnect: btcWalletDisconnect } = useSatsDisconnect();
    const { connectors: satsConnectors, connectAsync: satsConnectAsync } = useSatsConnect();

    const [pendingConnector, setPendingConnector] = useState<Connector>();
    const [pendingSatsConnector, setPendingSatsConnector] = useState<SatsConnector>();

    useAccountEffect({
      onConnect: (data) => {
        if (isOpen) {
          onConnectEvm?.(data);
        }
      }
    });

    const handleResetStep = () => setStep(undefined);

    const handleClose = useCallback(() => {
      onClose();

      // avoid content shift before the modal close
      setTimeout(() => handleResetStep(), 150);
    }, [onClose]);

    const handleDisconnect = () => {
      handleClose();

      // avoid content shift before the modal close
      setTimeout(() => disconnect(), 150);
    };

    const handleBtcWalletDisconnect = () => {
      handleClose();

      // avoid content shift before the modal close
      return setTimeout(() => btcWalletDisconnect(), 150);
    };

    const handleEvmWalletSelect = useCallback(
      async (key: Selection) => {
        // FIXME: simplify this in our UI lib also selectionBehavior throws error
        const [selectedKey] = [...(key as any)];

        const connector = connectors.find((el) => el.id === selectedKey);

        if (!connector) {
          return handleClose();
        }

        setPendingConnector(connector);

        try {
          await connectAsync({
            connector
          });
        } catch (e: any) {
          setPendingConnector(undefined);

          if (e?.code === 4001) {
            return toast.error('User rejected the request');
          }

          if (e?.code === -32002) {
            return toast.error('Connect request is already pending');
          }

          return toast.error(`Failed to connect to ${connector.name}`);
        }

        setPendingConnector(undefined);

        return handleClose();
      },
      [connectors, handleClose, connectAsync]
    );

    const handleBtcWalletSelect = useCallback(
      async (key: Selection) => {
        // FIXME: simplify this in our UI lib also selectionBehavior throws error
        const [selectedKey] = [...(key as any)];

        const satsConnector = satsConnectors.find((el) => el.id === selectedKey);

        if (!satsConnector) {
          return handleClose();
        }

        setPendingSatsConnector(satsConnector);

        try {
          await satsConnectAsync({
            connector: satsConnector
          });
        } catch (e: any) {
          setPendingSatsConnector(undefined);

          if (!satsConnector.ready) {
            return;
          }

          return toast.error(e.message || `Failed to connect to ${satsConnector.name}`);
        }

        setPendingSatsConnector(undefined);

        return handleClose();
      },
      [satsConnectors, handleClose, satsConnectAsync]
    );

    const modalHeader =
      step === 'evm' ? (
        <Flex alignItems='center' gap='xs'>
          <Button
            isIconOnly
            aria-label='go back'
            size='s'
            style={{ height: '1.875rem', width: '1.875rem' }}
            variant='ghost'
            onPress={() => setStep(undefined)}
          >
            <ArrowLeft size='s' strokeWidth={2} />
          </Button>
          Select EVM Wallet
        </Flex>
      ) : step === 'btc' ? (
        <Flex alignItems='center' gap='xs'>
          <Button
            isIconOnly
            aria-label='go back'
            size='s'
            style={{ height: '1.875rem', width: '1.875rem' }}
            variant='ghost'
            onPress={() => setStep(undefined)}
          >
            <ArrowLeft size='s' strokeWidth={2} />
          </Button>
          Select Bitcoin Wallet
        </Flex>
      ) : (
        'Connect Wallet'
      );

    return (
      <Modal
        {...props}
        ref={ref}
        isOpen={isOpen}
        placement='top'
        shouldCloseOnInteractOutside={(el) => {
          // MEMO: handles not allowing modal to be closed when connector modals are open
          const ledgerModal = document.getElementById('ModalWrapper');

          if (ledgerModal) return false;

          if (el.tagName.toLocaleLowerCase() === 'wcm-modal') return false;

          const walletConnect = document.querySelector('[class*="connect-dialog"]');

          if (walletConnect?.contains(el)) return false;

          return true;
        }}
        onClose={handleClose}
      >
        <ModalHeader align='start' size='xl'>
          {modalHeader}
        </ModalHeader>
        <ModalBody gap='xl'>
          {type === 'both' && !step && (
            <>
              <P size='s'>
                On BOB, you have the option to link both your EVM and BTC wallets. For optimal functionality, it&apos;s
                advised to connect wallets from both networks.
              </P>
              <Flex direction='column' gap='lg'>
                {connector && address ? (
                  <ConnectedWalletSection
                    address={address}
                    icon={connector.icon}
                    type='evm'
                    wallet={connector.name}
                    onDisconnect={handleDisconnect}
                  />
                ) : (
                  <ConnectWalletCard label='Connect your EVM Wallet (Mandatory)' onPress={() => setStep('evm')} />
                )}
                {btcWalletConnector && btcWalletAddress ? (
                  <ConnectedWalletSection
                    address={btcWalletAddress}
                    icon={btcWalletConnector.icon}
                    type='btc'
                    wallet={btcWalletConnector.name}
                    onDisconnect={handleBtcWalletDisconnect}
                  />
                ) : (
                  <ConnectWalletCard
                    isDisabled={!connector || !address}
                    label='Connect your Bitcoin Wallet (Optional)'
                    onPress={() => setStep('btc')}
                  />
                )}
              </Flex>
            </>
          )}
          {(step === 'evm' || type === 'evm') && (
            <WalletList
              connector={connector}
              connectors={connectors}
              pendingConnector={pendingConnector}
              onSelectionChange={handleEvmWalletSelect as any}
            />
          )}
          {(step === 'btc' || type === 'btc') && (
            <WalletList
              connector={btcWalletConnector}
              connectors={satsConnectors}
              pendingConnector={pendingSatsConnector}
              onSelectionChange={handleBtcWalletSelect as any}
            />
          )}
        </ModalBody>
        {!step && (
          <ModalFooter>
            <Button color='primary' size='xl' onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        )}
      </Modal>
    );
  }
);

ConnectModal.displayName = 'ConnectModal';

export { ConnectModal };
export type { ConnectModalProps, ConnectEvmHandler, ConnectBtcHandler };
