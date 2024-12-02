import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAccount, usePublicClient } from 'wagmi';

import { FusionLockAbi } from '../abis/FusionLock.abi';
import { ContractType, INTERVAL, L1_CHAIN, getContract } from '../constants';

import { TokenData, useTokens } from '.';

const useLockedTokens = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient({ chainId: L1_CHAIN });

  const lockContract = useMemo(() => getContract(L1_CHAIN, ContractType.FUSION_LOCK), []);

  const { data: l1Tokens } = useTokens(L1_CHAIN);

  return useQuery({
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryKey: ['locked-tokens', address],
    enabled: Boolean(l1Tokens && address && publicClient),
    refetchInterval: (query) => (query.state.data && query.state.data.length > 0 ? INTERVAL.SECONDS_15 : false),
    queryFn: async () => {
      const lockedTokens = (
        await Promise.all(
          l1Tokens!
            .filter((token) => !token.raw.bridgeDisabled)
            .map(async (token) => {
              try {
                const amount = await publicClient!.readContract({
                  abi: FusionLockAbi,
                  address: lockContract.address,
                  functionName: 'deposits',
                  args: [address!, token.raw.address]
                });

                return amount > 0n ? token : undefined;
              } catch (e) {
                return undefined;
              }
            })
        )
      ).filter(Boolean);

      return lockedTokens as TokenData[];
    }
  });
};

export { useLockedTokens };
