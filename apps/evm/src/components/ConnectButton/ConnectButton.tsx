'use client';

import { isEthereumWallet } from '@dynamic-labs/ethereum';
import { useDynamicContext, useDynamicEvents, useIsLoggedIn, useSwitchWallet } from '@dynamic-labs/sdk-react-core';
import { Button } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useStore } from '@tanstack/react-store';
import { useState } from 'react';
import { useTheme } from 'styled-components';
import { useMediaQuery } from 'usehooks-ts';
import { Drawer } from 'vaul';
import { isBitcoinWallet } from '@dynamic-labs/bitcoin';

import { ProfileDrawer } from '../ProfileDrawer';
import { ProfileTag } from '../ProfileTag';

import { StyledContent, StyledMobileContentWrapper, StyledTrigger, StyledUnderlay } from './ConnectButton.style';

import { useDynamicWallets } from '@/hooks';
import { store } from '@/lib/store';

const ConnectButton = (): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('s'));

  const isReceiveModalOpen = useStore(store, (state) => state.shared.isReceiveModalOpen);

  const [isOpen, setOpen] = useState(false);

  const { setShowAuthFlow, handleUnlinkWallet } = useDynamicContext();
  const switchWallet = useSwitchWallet();
  const isLoggedIn = useIsLoggedIn();

  const { btcWallet, evmWallet } = useDynamicWallets();

  const isLoading = isLoggedIn && !(btcWallet || evmWallet);

  useDynamicEvents('walletAdded', async (newWallet, userWallets) => {
    const otherWallets = userWallets.filter((wallet) => wallet.id !== newWallet.id);

    // Only newWallet is conencted
    if (!otherWallets.length) return;

    if (isEthereumWallet(newWallet)) {
      await switchWallet(newWallet.id);

      const evmWallet = otherWallets.find((wallet) => isEthereumWallet(wallet));

      // unlink if there is another evm wallet
      if (evmWallet) {
        handleUnlinkWallet(evmWallet.id);
      }
    }

    if (isBitcoinWallet(newWallet)) {
      const btcWallet = otherWallets.find((wallet) => isBitcoinWallet(wallet) && wallet.id !== newWallet.id);

      // unlink if there is another btc wallet
      if (btcWallet) {
        handleUnlinkWallet(btcWallet.id);
      }
    }
  });

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
      <StyledTrigger disabled={isLoading}>
        <ProfileTag hideAddress={isMobile} size='s' />
      </StyledTrigger>
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
