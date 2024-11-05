import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useMemo } from 'react';
import { Address, isAddressEqual } from 'viem';
import { useAccount } from '@gobob/wagmi';

const useIsDynamicSmartAccount = () => {
  const { address } = useAccount();
  const { user } = useDynamicContext();

  return useMemo(
    () =>
      !!(
        address &&
        user?.verifiedCredentials.find(
          (credentials) =>
            credentials.walletProvider === 'smartContractWallet' &&
            isAddressEqual(credentials.address as Address, address)
        )
      ),
    [address, user?.verifiedCredentials]
  );
};

export { useIsDynamicSmartAccount };
