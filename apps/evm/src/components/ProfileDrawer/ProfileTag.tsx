'use client';

import { UserProfile } from '@dynamic-labs/sdk-react-core';
import { Flex, Span } from '@gobob/ui';
import { truncateBtcAddress, truncateEthAddress } from '@gobob/utils';
import ProfileAvatar from 'boring-avatars';
import { Address } from 'viem';

const sizeMap = {
  s: {
    icon: '1.5rem',
    text: 's'
  },
  md: {
    icon: '2rem',
    text: 'md'
  }
} as const;

const ProfileTag = ({
  evmAddress,
  btcAddress,
  user,
  size = 's',
  isLoading
}: {
  btcAddress?: string;
  evmAddress?: Address;
  user?: UserProfile;
  size?: 's' | 'md';
  isLoading?: boolean;
}) => {
  const displayedAddress = evmAddress
    ? truncateEthAddress(evmAddress)
    : btcAddress
      ? truncateBtcAddress(btcAddress)
      : undefined;

  return (
    <Flex alignItems='center' elementType='span' gap='md'>
      {user?.userId ? <ProfileAvatar name={user.userId} size={sizeMap[size].icon} /> : undefined}
      <Span size={sizeMap[size].text} weight='semibold'>
        {displayedAddress}
      </Span>
    </Flex>
  );
};

export { ProfileTag };
