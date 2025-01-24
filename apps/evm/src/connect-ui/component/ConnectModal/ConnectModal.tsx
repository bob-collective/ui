'use client';

import {
  SatsConnector,
  useAccount as useSatsAccount,
  useConnect as useSatsConnect,
  useDisconnect as useSatsDisconnect
} from '@gobob/sats-wagmi';
import {
  ArrowLeft,
  Button,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
  P,
  toast
} from '@gobob/ui';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { Connector, useAccount, useAccountEffect, useConnect, useDisconnect } from 'wagmi';
import { Address } from 'viem';
import { sendGAEvent } from '@next/third-parties/google';

import { ConnectType, WalletType } from '../../types';

import { BtcWalletList } from './BtcWalletList';
import { ConnectedWalletSection } from './ConnectedWalletSection';
import { ConnectWalletCard } from './ConnectWalletCard';
import { EvmWalletList } from './EvmWalletList';

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
    const { i18n } = useLingui();
    const { connector, address } = useAccount();
    const { disconnect } = useDisconnect();
    const { connectors, connectAsync } = useConnect();
    const [step, setStep] = useState<WalletType | undefined>(stepProp);
    const { address: btcWalletAddress, connector: btcWalletConnector } = useSatsAccount({ onConnect: onConnectBtc });
    const { disconnect: btcWalletDisconnect } = useSatsDisconnect();
    const { connectors: satsConnectors, connectAsync: satsConnectAsync } = useSatsConnect();

    const [pendingConnector, setPendingConnector] = useState<Connector>();
    const [pendingSatsConnector, setPendingSatsConnector] = useState<SatsConnector>();

    // override properties set by OverlayProvider provider in ui/src/system
    useEffect(() => {
      if (pendingConnector?.id === 'walletConnect') {
        const modals = document.querySelectorAll('wcm-modal');

        // Set the aria-hidden attribute to true for each wcm-modal element
        modals.forEach((modal) => {
          modal.setAttribute('data-react-aria-top-layer', 'true');
          modal.removeAttribute('aria-hidden');
        });
      }
    }, [pendingConnector]);

    useAccountEffect({
      onConnect: (data) => {
        if (isOpen) {
          onConnectEvm?.(data);
        }
      }
    });

    const handleResetStep = () => setStep(undefined);

    const handleClose = useCallback(() => {
      onClose?.();

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [selectedKey] = [...(key as any)];

        const connector = connectors.find((el) => el.id === selectedKey);

        if (!connector) {
          return handleClose();
        }

        setPendingConnector(connector);

        try {
          const connectData = await connectAsync({
            connector
          });

          sendGAEvent('event', 'evm_connect', { address: connectData.accounts, evm_wallet: connector.name });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          setPendingConnector(undefined);

          if (e?.code === 4001) {
            return toast.error(<Trans>User rejected the request</Trans>);
          }

          if (e?.code === -32002) {
            return toast.error(<Trans>Connect request is already pending</Trans>);
          }

          return toast.error(<Trans>Failed to connect to {connector.name}</Trans>);
        }

        setPendingConnector(undefined);

        return handleClose();
      },
      [connectors, handleClose, connectAsync]
    );

    const handleBtcWalletSelect = useCallback(
      async (key: Selection) => {
        // FIXME: simplify this in our UI lib also selectionBehavior throws error
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [selectedKey] = [...(key as any)];

        const satsConnector = satsConnectors.find((el) => el.id === selectedKey);

        if (!satsConnector) {
          return handleClose();
        }

        setPendingSatsConnector(satsConnector);

        try {
          const btcAddress = await satsConnectAsync({
            connector: satsConnector
          });

          sendGAEvent('event', 'btc_connect', { address: btcAddress.address, btc_wallet: btcWalletConnector?.name });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          setPendingSatsConnector(undefined);

          if (!satsConnector.ready) {
            return;
          }

          return toast.error(e.message || <Trans>Failed to connect to {satsConnector.name}</Trans>);
        }

        setPendingSatsConnector(undefined);

        return handleClose();
      },
      [satsConnectors, handleClose, satsConnectAsync, btcWalletConnector?.name]
    );

    const modalHeader =
      step === 'evm' ? (
        <Flex alignItems='center' gap='xs'>
          <Button
            isIconOnly
            aria-label={t(i18n)`go back`}
            size='s'
            style={{ height: '1.875rem', width: '1.875rem' }}
            variant='ghost'
            onPress={() => setStep(undefined)}
          >
            <ArrowLeft size='s' strokeWidth={2} />
          </Button>
          <Trans>Select EVM Wallet</Trans>
        </Flex>
      ) : step === 'btc' ? (
        <Flex alignItems='center' gap='xs'>
          <Button
            isIconOnly
            aria-label={t(i18n)`go back`}
            size='s'
            style={{ height: '1.875rem', width: '1.875rem' }}
            variant='ghost'
            onPress={() => setStep(undefined)}
          >
            <ArrowLeft size='s' strokeWidth={2} />
          </Button>
          <Trans>Select Bitcoin Wallet</Trans>
        </Flex>
      ) : (
        <Trans>Connect Wallet</Trans>
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
        <ModalBody gap='xl' padding={step && 'even'}>
          {type === 'both' && !step && (
            <>
              <P size='s'>
                <Trans>
                  On BOB, you have the option to link both your EVM and BTC wallets. For optimal functionality,
                  it&apos;s advised to connect wallets from both networks.
                </Trans>
              </P>
              <P size='s'>
                <Trans>By clicking &lsquo;Connect&rsquo; you acknowledge and agree to the </Trans>
                <Link
                  external
                  href='https://cdn.prod.website-files.com/6620e8932695794632789d89/668eaca0c8c67436ee679ca0_GoBob%20-%20Terms%20of%20Service%20(LW%20draft%207-9)(149414568.5).pdf'
                  size='inherit'
                >
                  <Trans>Terms of Service</Trans>
                </Link>{' '}
                <Trans>and that you have read and understood our </Trans>
                <Link
                  external
                  href='https://cdn.prod.website-files.com/6620e8932695794632789d89/675872861db67a29ec01d237_BOB%20Foundation%20-%20Privacy%20Policy.pdf'
                  size='inherit'
                >
                  <Trans>Privacy policy</Trans>
                </Link>
                .
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
                  <ConnectWalletCard
                    label={<Trans>Connect your EVM Wallet (Mandatory)</Trans>}
                    onPress={() => setStep('evm')}
                  />
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
                    label={<Trans>Connect your Bitcoin Wallet (Optional)</Trans>}
                    onPress={() => setStep('btc')}
                  />
                )}
              </Flex>
            </>
          )}
          {(step === 'evm' || type === 'evm') && (
            <EvmWalletList
              connector={connector}
              connectors={connectors}
              pendingConnector={pendingConnector}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onSelectionChange={handleEvmWalletSelect as any}
            />
          )}
          {(step === 'btc' || type === 'btc') && (
            <BtcWalletList
              connector={btcWalletConnector}
              connectors={satsConnectors}
              pendingConnector={pendingSatsConnector}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
export type { ConnectBtcHandler, ConnectEvmHandler, ConnectModalProps };
