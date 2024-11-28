'use client';

import { useAccount } from '@gobob/wagmi';
import { useMemo } from 'react';
import { createWalletClient, custom, http } from 'viem';
import { walletActionsL1, walletActionsL2 } from 'viem/op-stack';
import { useIsClient } from 'usehooks-ts';

import { chainL1, chainL2 } from '../constants';

const useWalletClientL2 = () => {
  const { address } = useAccount();
  const isClient = useIsClient();

  return useMemo(
    () =>
      createWalletClient({
        account: address,
        chain: chainL2,
        transport: isClient ? custom(window?.ethereum) : http()
      }).extend(walletActionsL2()),
    [address, isClient]
  );
};

const useWalletClientL1 = () => {
  const { address } = useAccount();
  const isClient = useIsClient();

  return useMemo(
    () =>
      createWalletClient({
        account: address,
        chain: chainL1,
        transport: isClient ? custom(window?.ethereum) : http()
      }).extend(walletActionsL1()),

    [address, isClient]
  );
};

export { useWalletClientL1, useWalletClientL2 };
