'use client';

import { BitcoinWallet } from '@dynamic-labs/bitcoin';
import { useUserWallets } from '@dynamic-labs/sdk-react-core';

type UserBtcDynamicWalletReturnType = BitcoinWallet | undefined;

const useBtcDynamicWallet = (): UserBtcDynamicWalletReturnType => {
  const userWallets = useUserWallets();

  return userWallets.find((wallet) => wallet.chain === 'BTC') as BitcoinWallet | undefined;
};

export { useBtcDynamicWallet };
