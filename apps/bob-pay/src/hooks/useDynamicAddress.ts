import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useMemo } from 'react';
import { Address } from 'viem';
import { useAccount } from '@gobob/wagmi';

// This only works if we only enable embedded wallets to be smart accounts
const useDynamicAddress = () => {
  const { address } = useAccount();
  const { user } = useDynamicContext();

  const dynamicAccount = useMemo(() => {
    const smartAccount = user?.verifiedCredentials.find(
      (credentials) => credentials.walletProvider === 'smartContractWallet'
    );

    if (smartAccount) {
      return smartAccount;
    }

    return user?.verifiedCredentials.find((credentials) => credentials.walletProvider === 'browserExtension');
  }, [user?.verifiedCredentials]);

  return (dynamicAccount?.address as Address) || address;
};

export { useDynamicAddress };
