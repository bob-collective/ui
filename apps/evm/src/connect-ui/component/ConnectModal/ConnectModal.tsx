'use client';

import { BTC, ETH } from '@gobob/icons';
import { SatsConnector, useAccount as useSatsAccount, useConnect as useSatsConnect } from '@gobob/sats-wagmi';
import { Flex, Link, Modal, ModalBody, ModalHeader, ModalProps, P, Span, Tabs, TabsItem, toast } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { sendGAEvent } from '@next/third-parties/google';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { Address } from 'viem';
import { Connector, useAccount, useAccountEffect, useConnect } from 'wagmi';

import { WalletType } from '../../types';

import { BtcWalletList } from './BtcWalletList';
import { EvmWalletList } from './EvmWalletList';

import { ExternalLinks } from '@/constants';
import { posthogEvents } from '@/lib/posthog';

type ConnectEvmHandler = ({ address }: { address?: Address; connector?: Connector; isReconnected: boolean }) => void;

type ConnectBtcHandler = ({ address }: { address?: string }) => void;

type Props = {
  type?: WalletType;
  onConnectEvm?: ConnectEvmHandler;
  onConnectBtc?: ConnectBtcHandler;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type ConnectModalProps = Props & InheritAttrs;

const ConnectModal = forwardRef<HTMLDivElement, ConnectModalProps>(
  ({ onClose, isOpen, type, onConnectEvm, onConnectBtc, ...props }, ref) => {
    const { connector } = useAccount();
    const { connectors, connectAsync } = useConnect();
    const { connector: btcWalletConnector } = useSatsAccount({ onConnect: onConnectBtc });
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

    const handleClose = useCallback(() => {
      onClose?.();
    }, [onClose]);

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

          sendGAEvent('event', 'evm_connect', {
            evm_address: JSON.stringify(connectData.accounts),
            evm_wallet: connector.name
          });

          posthogEvents.wallet.evm.connect({ evm_address: connectData.accounts[0], wallet_name: connector.name });

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

          sendGAEvent('event', 'btc_connect', {
            btc_address: btcAddress.address,
            btc_wallet: satsConnector?.name
          });
          posthogEvents.wallet.btc.connect({
            btc_address: btcAddress.address as string,
            wallet_name: satsConnector?.name
          });

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
      [satsConnectors, handleClose, satsConnectAsync]
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
          <Trans>Connect Wallet</Trans>
        </ModalHeader>
        <ModalBody gap='xl' padding='even'>
          <Tabs fullWidth defaultSelectedKey={type}>
            <TabsItem
              key={WalletType.EVM}
              title={
                <Flex alignItems='center' gap='md'>
                  <ETH />
                  <Span size='lg' weight='semibold'>
                    ETH
                  </Span>
                </Flex>
              }
            >
              <EvmWalletList
                connector={connector}
                connectors={connectors}
                pendingConnector={pendingConnector}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onSelectionChange={handleEvmWalletSelect as any}
              />
            </TabsItem>
            <TabsItem
              key={WalletType.BTC}
              title={
                <Flex alignItems='center' gap='md'>
                  <BTC />
                  <Span size='lg' weight='semibold'>
                    BTC
                  </Span>
                </Flex>
              }
            >
              <BtcWalletList
                connector={btcWalletConnector}
                connectors={satsConnectors}
                pendingConnector={pendingSatsConnector}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onSelectionChange={handleBtcWalletSelect as any}
              />{' '}
            </TabsItem>
          </Tabs>
          <P align='center' color='grey-50' size='xs'>
            <Trans>By connecting your wallet, you confirm that you&apos;ve read and agree to our</Trans>{' '}
            <Link external href={ExternalLinks.TERMS_OF_SERVICE} size='inherit' underlined='always'>
              <Trans>Terms of Service</Trans>
            </Link>{' '}
            <Trans>and</Trans>{' '}
            <Link external href={ExternalLinks.PRIVACY_POLICY} size='inherit' underlined='always'>
              <Trans>Privacy policy</Trans>
            </Link>
            .
          </P>
        </ModalBody>
      </Modal>
    );
  }
);

ConnectModal.displayName = 'ConnectModal';

export { ConnectModal };
export type { ConnectBtcHandler, ConnectEvmHandler, ConnectModalProps };
