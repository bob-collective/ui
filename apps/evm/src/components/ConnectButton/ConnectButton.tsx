'use client';

import { useAccount as useSatsAccount } from '@gobob/sats-wagmi';
import { Button, DrawerContent, DrawerOverlay, DrawerPortal, DrawerRoot, DrawerTitle, DrawerTrigger } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useStore } from '@tanstack/react-store';
import { useState } from 'react';
import { useTheme } from 'styled-components';
import { useMediaQuery } from 'usehooks-ts';
import { useAccount } from 'wagmi';

import { ProfileTag } from '../ProfileTag';
import { ProfileDrawer } from '../ProfileDrawer';

import { useConnectModal } from '@/connect-ui';
import { store } from '@/lib/store';

const ConnectButton = (): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('s'));

  const { address: evmAddress } = useAccount();
  const { address: btcAddress } = useSatsAccount();

  const isReceiveModalOpen = useStore(store, (state) => state.shared.isReceiveModalOpen);

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
      dismissible={!isReceiveModalOpen}
      open={isOpen}
      onOpenChange={setOpen}
    >
      <DrawerTrigger>
        <ProfileTag hideAddress={isMobile} size='s' />
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerTitle hidden>Profile</DrawerTitle>
          <ProfileDrawer onClose={handleClose} />
        </DrawerContent>
      </DrawerPortal>
    </DrawerRoot>
  );
};

export { ConnectButton };
