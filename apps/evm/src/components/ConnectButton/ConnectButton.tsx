'use client';

import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import { Button } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useStore } from '@tanstack/react-store';
import { useState } from 'react';
import { useTheme } from 'styled-components';
import { useMediaQuery } from 'usehooks-ts';
import { Drawer } from 'vaul';
import { useAccount } from 'wagmi';

import { ProfileDrawer } from '../ProfileDrawer';
import { ProfileTag } from '../ProfileTag';

import { StyledContent, StyledMobileContentWrapper, StyledUnderlay } from './ConnectButton.style';

import { useBtcAccount } from '@/hooks';
import { store } from '@/lib/store';

const ConnectButton = (): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('s'));

  const isReceiveModalOpen = useStore(store, (state) => state.shared.isReceiveModalOpen);

  const [isOpen, setOpen] = useState(false);

  const { setShowAuthFlow } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();

  const { address: evmAddress } = useAccount();
  const { address: btcAddress } = useBtcAccount();

  const isLoading = isLoggedIn && !(evmAddress || btcAddress);

  // const isAuthenticated = evmAddress || btcAddress;

  if (!isLoggedIn) {
    const handleConnect = () => {
      setShowAuthFlow(true);
    };

    return (
      <Button variant='ghost' onPress={handleConnect}>
        <Trans>Connect Wallet</Trans>
      </Button>
    );
  }

  const handleClose = () => setOpen(false);

  return (
    <Drawer.Root
      direction={isMobile ? 'bottom' : 'right'}
      dismissible={!isReceiveModalOpen}
      open={isOpen}
      onOpenChange={setOpen}
    >
      <Drawer.Trigger asChild>
        <Button disabled={isLoading} variant='ghost'>
          <ProfileTag hideAddress={isMobile} size='s' />
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <StyledUnderlay />
        <StyledContent>
          <StyledMobileContentWrapper>
            <Drawer.Title hidden>Profile</Drawer.Title>
            <ProfileDrawer onClose={handleClose} />
          </StyledMobileContentWrapper>
        </StyledContent>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export { ConnectButton };
