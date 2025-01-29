'use client';

import { WalletIcon } from '@dynamic-labs/wallet-book';
import { Flex, Span, SpanProps } from '@gobob/ui';
import { truncateBtcAddress, truncateEthAddress } from '@gobob/utils';
import ProfileAvatar from 'boring-avatars';
import { Chain } from 'viem';
import { useAccount } from 'wagmi';

import { ChainAsset } from '../ChainAsset';
import { CopyAddress } from '../CopyAddress';

import { useBtcAccount, useDynamicWallets } from '@/hooks';

const sizeMap = {
  s: {
    icon: '1.5rem',
    text: 's',
    chain: '0.75rem'
  },
  md: {
    icon: '2rem',
    text: 'md',
    chain: '1rem'
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
  const { address: evmAddress } = useAccount();
  const { address: btcAddress, connector: btcConnector } = useBtcAccount();
  const { evmWallet } = useDynamicWallets();

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
            evmWallet ? (
              <WalletIcon
                style={{ width: sizeMap[size].chain, height: sizeMap[size].chain }}
                walletKey={evmWallet.key}
              />
            ) : btcConnector ? (
              <WalletIcon
                style={{ width: sizeMap[size].chain, height: sizeMap[size].chain }}
                walletKey={btcConnector.key}
              />
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
