import { useAccount } from '@gobob/wagmi';
import { useMemo } from 'react';
import { createWalletClient, custom } from 'viem';
import { walletActionsL1, walletActionsL2 } from 'viem/op-stack';

import { chainL1, chainL2 } from '../constants';

const useWalletClientL2 = () => {
  const { address } = useAccount();

  return useMemo(
    () =>
      createWalletClient({
        account: address,
        chain: chainL2,
        transport: custom(window.ethereum)
      }).extend(walletActionsL2()),
    [address]
  );
};

const useWalletClientL1 = () => {
  const { address } = useAccount();

  return useMemo(
    () =>
      createWalletClient({
        account: address,
        chain: chainL1,
        transport: custom(window.ethereum)
      }).extend(walletActionsL1()),

    [address]
  );
};

export { useWalletClientL1, useWalletClientL2 };
