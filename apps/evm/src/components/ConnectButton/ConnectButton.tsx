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
import { useEffect, useState } from 'react';
import { useTheme } from 'styled-components';
import { useMediaQuery } from 'usehooks-ts';
import { useAccount } from 'wagmi';

import { Profile } from '../Profile';
import { ProfileTag } from '../ProfileTag';

import { StyledCloseButton } from './ConnectButton.style';

import { useConnectModal } from '@/connect-ui';
import { chainL1, chainL2, isValidChain } from '@/constants';
import { store } from '@/lib/store';

const ConnectButton = (): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('s'));

  const [isProfileDrawerOpen, setProfileDrawerOpen] = useState(false);

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
    if (!isProfileDrawerOpen && hasOpenned) return;

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

  const handleClose = () => setProfileDrawerOpen(false);

  return (
    <DrawerRoot
      direction={isMobile ? 'bottom' : 'right'}
      dismissible={!(isReceiveModalOpen || isConnectModalOpen)}
      modal={isMobile}
      open={isProfileDrawerOpen}
      onOpenChange={setProfileDrawerOpen}
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
          <Profile currentChain={currentChain} hasOpenned={hasOpenned} otherChain={otherChain} onClose={handleClose} />
        </DrawerContent>
      </DrawerPortal>
    </DrawerRoot>
  );
};

export { ConnectButton };
