'use client';

import { useDynamicContext, UserProfile } from '@dynamic-labs/sdk-react-core';
import { Button, Flex, Span } from '@gobob/ui';
import { truncateBtcAddress, truncateEthAddress } from '@gobob/utils';
import { Trans } from '@lingui/macro';
import ProfileAvatar from 'boring-avatars';
import { useState } from 'react';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

import { ProfileDrawer } from '../ProfileDrawer';

import { useBtcAccount } from '@/hooks';

const Profile = ({
  evmAddress,
  btcAddress,
  user
}: {
  btcAddress?: string;
  evmAddress?: Address;
  user?: UserProfile;
}) => {
  const displayedAddress = evmAddress
    ? truncateEthAddress(evmAddress)
    : btcAddress
      ? truncateBtcAddress(btcAddress)
      : undefined;

  return (
    <Flex alignItems='center' elementType='span' gap='s'>
      {user?.userId ? <ProfileAvatar name={user.userId} size='1.5rem' /> : undefined}
      <Span size='s'>{displayedAddress}</Span>
    </Flex>
  );
};

const ConnectButton = (): JSX.Element => {
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

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  return (
    <>
      <Button variant='ghost' onPress={handleOpen}>
        <Profile btcAddress={btcAddress} evmAddress={evmAddress} user={user} />
      </Button>
      <ProfileDrawer isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export { ConnectButton };
