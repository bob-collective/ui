'use client';

import { isEthereumWallet } from '@dynamic-labs/ethereum';
import { isBitcoinWallet } from '@dynamic-labs/bitcoin';
import { useUserWallets } from '@dynamic-labs/sdk-react-core';

const useDynamicWallets = () => {
  const userWallets = useUserWallets();

  return {
    evmWallet: userWallets.find((wallet) => isEthereumWallet(wallet)),
    btcWallet: userWallets.find((wallet) => isBitcoinWallet(wallet))
  };
};

export { useDynamicWallets };
