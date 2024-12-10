'use client';

import { useDynamicContext, UserProfile } from '@dynamic-labs/sdk-react-core';
import { Button, Flex, Span } from '@gobob/ui';
import { truncateBtcAddress, truncateEthAddress } from '@gobob/utils';
import { Trans } from '@lingui/macro';
import ProfileAvatar from 'boring-avatars';
import { useState } from 'react';
import { Address } from 'viem';
import { useAccount } from 'wagmi';
import { Drawer } from 'vaul';
import { useMediaQuery } from 'usehooks-ts';
import { useTheme } from 'styled-components';

import { ProfileDrawer } from '../ProfileDrawer';

import { StyledMobileContentWrapper } from './ConnectButton.style';

import { useBtcAccount } from '@/hooks';

const Profile = ({
  evmAddress,
  btcAddress,
  user,
  hideAddress
}: {
  btcAddress?: string;
  evmAddress?: Address;
  user?: UserProfile;
  hideAddress?: boolean;
}) => {
  const displayedAddress = evmAddress
    ? truncateEthAddress(evmAddress)
    : btcAddress
      ? truncateBtcAddress(btcAddress)
      : undefined;

  return (
    <Flex alignItems='center' elementType='span' gap='s'>
      {user?.userId ? <ProfileAvatar name={user.userId} size='1.5rem' /> : undefined}
      {!hideAddress && <Span size='s'>{displayedAddress}</Span>}
    </Flex>
  );
};

const ConnectButton = (): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('s'));

  const { setShowAuthFlow, user } = useDynamicContext();
  const { address: evmAddress } = useAccount();
  const { address: btcAddress } = useBtcAccount();

  const [isOpen, setOpen] = useState(false);

  const isAuthenticated = evmAddress || btcAddress;

  if (!isAuthenticated) {
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

  if (isMobile) {
    return (
      <Drawer.Root direction='bottom' open={isOpen} onOpenChange={setOpen}>
        <Drawer.Trigger asChild>
          <Button variant='ghost'>
            <Profile hideAddress btcAddress={btcAddress} evmAddress={evmAddress} user={user} />
          </Button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay
            style={{
              position: 'fixed',
              top: '0',
              right: '0',
              bottom: '0',
              left: '0',
              backgroundColor: 'rgba(0, 0, 0, 0.6)'
            }}
          />
          <Drawer.Content
            style={{
              display: 'flex',
              position: 'fixed',
              right: '0',
              bottom: '0',
              left: '0',
              marginTop: '6rem',
              flexDirection: 'column',
              outlineStyle: 'none',
              height: 'calc(100% - 72px)'
            }}
          >
            <StyledMobileContentWrapper>
              <ProfileDrawer onClose={handleClose} />
            </StyledMobileContentWrapper>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <Drawer.Root direction='right' open={isOpen} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <Button variant='ghost'>
          <Profile btcAddress={btcAddress} evmAddress={evmAddress} user={user} />
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay
          style={{
            position: 'fixed',
            top: '0',
            right: '0',
            bottom: '0',
            left: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.6)'
          }}
        />
        <Drawer.Content
          style={
            {
              display: 'flex',
              position: 'fixed',
              top: '0.5rem',
              right: '0.5rem',
              bottom: '0.5rem',
              zIndex: 10,
              outlineStyle: 'none',
              width: '310px',
              '--initial-transform': 'calc(100% + 8px)'
            } as React.CSSProperties
          }
        >
          <ProfileDrawer onClose={handleClose} />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export { ConnectButton };
