'use client';

import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import { Flex, Skeleton, Span, SpanProps } from '@gobob/ui';
import { truncateBtcAddress, truncateEthAddress } from '@gobob/utils';
import ProfileAvatar from 'boring-avatars';
import { useAccount } from 'wagmi';

import { ChainAsset } from '../ChainAsset';
import { CopyAddress } from '../CopyAddress';

import { useBtcAccount } from '@/hooks';

const sizeMap = {
  s: {
    icon: '1.5rem',
    text: 's',
    chain: 'xxs'
  },
  md: {
    icon: '2rem',
    text: 'md',
    chain: 'xs'
  }
} as const;

const ProfileTag = ({
  size = 's',
  hideAddress,
  labelProps,
  isCopyEnabled
}: {
  size?: 's' | 'md';
  hideAddress?: boolean;
  labelProps?: SpanProps;
  isCopyEnabled?: boolean;
}) => {
  const { user, primaryWallet, sdkHasLoaded } = useDynamicContext();

  const { address: evmAddress, chain } = useAccount();
  const { address: btcAddress } = useBtcAccount();
  const isLoggedIn = useIsLoggedIn();

  const fallbackEvmAddress = primaryWallet?.chain === 'EVM' ? primaryWallet.address : evmAddress;

  const isLoading = !sdkHasLoaded || (isLoggedIn && !(fallbackEvmAddress || btcAddress));

  if (isLoading) {
    return (
      <Flex alignItems='center' elementType='span' gap='md'>
        <Skeleton height='1.5rem' rounded='full' width='1.5rem' />
        {!hideAddress && <Skeleton width='6.25rem' />}
      </Flex>
    );
  }

  const address = fallbackEvmAddress || btcAddress;

  const truncatedAddress = fallbackEvmAddress
    ? truncateEthAddress(fallbackEvmAddress)
    : btcAddress
      ? truncateBtcAddress(btcAddress)
      : undefined;

  return (
    <Flex alignItems='center' elementType='span' gap='md'>
      {user?.userId ? (
        <ChainAsset
          asset={<ProfileAvatar name={user.userId} size={sizeMap[size].icon} />}
          chainId={chain?.id}
          chainProps={{ size: sizeMap[size].chain }}
          style={{ pointerEvents: 'none' }}
        />
      ) : undefined}
      {hideAddress ? undefined : isCopyEnabled ? (
        <CopyAddress
          {...labelProps}
          address={address || ''}
          iconVisibility='hover'
          size={sizeMap[size].text}
          truncatedAddress={truncatedAddress}
        />
      ) : (
        <Span size={sizeMap[size].text} weight='semibold'>
          {truncatedAddress}
        </Span>
      )}
    </Flex>
  );
};

export { ProfileTag };