'use client';

import { useAccount as useSatsAccount } from '@gobob/sats-wagmi';
import {
  Button,
  ChevronDoubleRight,
  DrawerButton,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle
} from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useStore } from '@tanstack/react-store';
import { useEffect } from 'react';
import { useTheme } from 'styled-components';
import { useMediaQuery } from 'usehooks-ts';
import { useAccount } from 'wagmi';

import { Profile } from '../Profile';
import { ProfileTag } from '../ProfileTag';

import { StyledCloseButton } from './ConnectButton.style';

import { useConnectModal } from '@/connect-ui';
import { chainL1, chainL2, isValidChain } from '@/constants';
import { store } from '@/lib/store';
import { useUserAgent } from '@/user-agent';

const ConnectButton = (): JSX.Element => {
  const theme = useTheme();
  const isMobileViewport = useMediaQuery(theme.breakpoints.down('md'));
  const { isMobile: isMobileUserAgent } = useUserAgent();

  const isMobile = isMobileViewport || isMobileUserAgent;

  const isProfileDrawerOpen = useStore(store, (state) => state.shared.profile.isOpen);

  const { address: evmAddress, chain } = useAccount();
  const { address: btcAddress } = useSatsAccount();

  const currentChain = chain && isValidChain(chain.id) ? chain : chainL2;
  const otherChain = currentChain.id === chainL2.id ? chainL1 : chainL2;

  const isReceiveModalOpen = useStore(store, (state) => state.shared.isReceiveModalOpen);
  const hasOpenned = useStore(store, (state) => state.shared.profile.hasOpenned);

  const { isOpen: isConnectModalOpen } = useConnectModal();

  const { open } = useConnectModal();

  const isLoggedIn = !!(evmAddress || btcAddress);

  useEffect(() => {
    if (!isProfileDrawerOpen && !isLoggedIn && hasOpenned) return;

    store.setState((state) => ({
      ...state,
      shared: {
        ...state.shared,
        profile: {
          ...state.shared.profile,
          hasOpenned: true
        }
      }
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProfileDrawerOpen]);

  // temporary fix (https://github.com/emilkowalski/vaul/issues/492)
  useEffect(() => {
    if (!isProfileDrawerOpen || isMobile) return;

    const originalPointerEvents = document.body.style.pointerEvents;

    const raf = window.requestAnimationFrame(() => {
      document.body.style.pointerEvents = 'auto';
    });

    return () => {
      window.cancelAnimationFrame(raf);
      document.body.style.pointerEvents = originalPointerEvents;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProfileDrawerOpen]);

  // track if the drawer has been open
  useEffect(() => {
    if (!isProfileDrawerOpen && !isLoggedIn) return;

    store.setState((state) => ({
      ...state,
      shared: {
        ...state.shared,
        profile: {
          ...state.shared.profile,
          hasOpenned: true
        }
      }
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProfileDrawerOpen]);

  // ensure that if isProfileDrawerOpen is set to true, that we show the
  // connect modal instead in case the user wallet is not connected
  useEffect(() => {
    if (!isLoggedIn && isProfileDrawerOpen) {
      return open();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProfileDrawerOpen]);

  if (!isLoggedIn) {
    const handleConnect = () => {
      open();
    };

    return (
      <Button style={{ marginLeft: 30 }} variant='ghost' onPress={handleConnect}>
        <Trans>Connect Wallet</Trans>
      </Button>
    );
  }

  const handleOpenChange = (open: boolean) =>
    store.setState((state) => ({
      ...state,
      shared: { ...state.shared, profile: { ...state.shared.profile, isOpen: open } }
    }));

  return (
    <DrawerRoot
      direction={isMobile ? 'bottom' : 'right'}
      dismissible={!(isReceiveModalOpen || isConnectModalOpen)}
      modal={isMobile}
      open={isProfileDrawerOpen}
      onOpenChange={handleOpenChange}
    >
      <DrawerButton variant='ghost'>
        <ProfileTag chain={currentChain} hideAddress={isMobile} size='s' />
      </DrawerButton>
      <DrawerPortal>
        {isMobile && <DrawerOverlay />}
        <DrawerContent>
          <StyledCloseButton $isOpen={isProfileDrawerOpen}>
            <ChevronDoubleRight color='grey-50' size='s' />
          </StyledCloseButton>
          <DrawerTitle hidden>
            <Trans>Profile</Trans>
          </DrawerTitle>
          <Profile
            currentChain={currentChain}
            hasOpenned={hasOpenned}
            otherChain={otherChain}
            onClose={() => handleOpenChange(false)}
          />
        </DrawerContent>
      </DrawerPortal>
    </DrawerRoot>
  );
};

export { ConnectButton };
