'use client';

import { Flex, Span, SpanProps } from '@gobob/ui';
import { truncateBtcAddress, truncateEthAddress } from '@gobob/utils';
import ProfileAvatar from 'boring-avatars';
import { useAccount } from 'wagmi';
import { useAccount as useSatsAccount } from '@gobob/sats-wagmi';
import { Chain } from 'viem';

import { ChainAsset } from '../ChainAsset';
import { CopyAddress } from '../CopyAddress';

import { WalletIcon } from '@/connect-ui';

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
  chain: Chain;
}) => {
  const { address: evmAddress, connector: evmConnector } = useAccount();
  const { address: btcAddress, connector: btcConnector } = useSatsAccount();

  const address = evmAddress || btcAddress;

  const truncatedAddress = evmAddress
    ? truncateEthAddress(evmAddress)
    : btcAddress
      ? truncateBtcAddress(btcAddress)
      : undefined;

  return (
    <Flex alignItems='center' elementType='span' gap='md'>
      {address ? (
        <ChainAsset
          asset={<ProfileAvatar name={address} size={sizeMap[size].icon} />}
          chainLogo={
            evmConnector ? (
              <WalletIcon name={evmConnector.name} size={sizeMap[size].chain} />
            ) : btcConnector ? (
              <WalletIcon name={btcConnector.name} size={sizeMap[size].chain} />
            ) : undefined
          }
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
