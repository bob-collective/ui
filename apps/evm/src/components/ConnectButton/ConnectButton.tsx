'use client';

import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import { Button } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useState } from 'react';
import { useTheme } from 'styled-components';
import { useMediaQuery } from 'usehooks-ts';
import { Drawer } from 'vaul';
import { useAccount } from 'wagmi';
import { useStore } from '@tanstack/react-store';

import { ProfileDrawer } from '../ProfileDrawer';
import { ProfileTag } from '../ProfileTag';

import { StyledContent, StyledMobileContentWrapper, StyledUnderlay } from './ConnectButton.style';

import { useBtcAccount } from '@/hooks';
import { store } from '@/lib/store';

const ConnectButton = (): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('s'));

  const isReceiveModalOpen = useStore(store, (state) => state.shared.isReceiveModalOpen);

  const { setShowAuthFlow, user } = useDynamicContext();
  const { address: evmAddress } = useAccount();
  const { address: btcAddress } = useBtcAccount();
  const isLoggedIn = useIsLoggedIn();
  const [isOpen, setOpen] = useState(false);

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

  const isLoading = isLoggedIn && !(evmAddress || btcAddress);

  return (
    <Drawer.Root
      direction={isMobile ? 'bottom' : 'right'}
      dismissible={!isReceiveModalOpen}
      open={isOpen}
      onOpenChange={setOpen}
    >
      <Drawer.Trigger asChild>
        <Button disabled={isLoading} variant='ghost'>
          <ProfileTag
            btcAddress={btcAddress}
            evmAddress={evmAddress}
            hideAddress={isMobile}
            isLoading={isLoading}
            size='s'
            user={user}
          />
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <StyledUnderlay />
        <StyledContent>
          <StyledMobileContentWrapper>
            <ProfileDrawer onClose={handleClose} />
          </StyledMobileContentWrapper>
        </StyledContent>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export { ConnectButton };
