'use client';

import { useAccount as useSatsAccount } from '@gobob/sats-wagmi';
import { Button, DrawerButton, DrawerContent, DrawerOverlay, DrawerPortal, DrawerRoot, DrawerTitle } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useStore } from '@tanstack/react-store';
import { useState } from 'react';
import { useTheme } from 'styled-components';
import { useMediaQuery } from 'usehooks-ts';
import { useAccount } from 'wagmi';

import { ProfileDrawer } from '../ProfileDrawer';
import { ProfileTag } from '../ProfileTag';

import { useConnectModal } from '@/connect-ui';
import { store } from '@/lib/store';

const ConnectButton = (): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('s'));

  const { address: evmAddress } = useAccount();
  const { address: btcAddress } = useSatsAccount();

  const isReceiveModalOpen = useStore(store, (state) => state.shared.isReceiveModalOpen);
  const { isOpen: isConnectModalOpen } = useConnectModal();

  const [isOpen, setOpen] = useState(false);
  const { open } = useConnectModal();

  const isLoggedIn = !!(evmAddress || btcAddress);

  if (!isLoggedIn) {
    const handleConnect = () => {
      open();
    };

    return (
      <Button variant='ghost' onPress={handleConnect}>
        <Trans>Connect Wallet</Trans>
      </Button>
    );
  }

  const handleClose = () => setOpen(false);

  return (
    <DrawerRoot
      direction={isMobile ? 'bottom' : 'right'}
      dismissible={!(isReceiveModalOpen || isConnectModalOpen)}
      open={isOpen}
      onOpenChange={setOpen}
    >
      <DrawerButton variant='ghost'>
        <ProfileTag hideAddress={isMobile} size='s' />
      </DrawerButton>
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerTitle hidden>
            <Trans>Profile</Trans>
          </DrawerTitle>
          <ProfileDrawer onClose={handleClose} />
        </DrawerContent>
      </DrawerPortal>
    </DrawerRoot>
  );
};

export { ConnectButton };
