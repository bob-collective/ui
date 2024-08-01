import { useAccount, usePublicClient } from '@gobob/wagmi';
import { useMemo } from 'react';
import { INTERVAL, useQuery } from '@gobob/react-query';

import { ContractType, L1_CHAIN, getContract } from '../../../constants';
import { TokenData, useTokens } from '../../../hooks';
import { FusionLockAbi } from '../../../abis/FusionLock.abi';

const useHaltedLockedTokens = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient({ chainId: L1_CHAIN });

  const lockContract = useMemo(() => getContract(L1_CHAIN, ContractType.FUSION_LOCK), []);

  const { data: l1Tokens } = useTokens(L1_CHAIN);

  return useQuery({
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryKey: ['halted-locked-tokens', address],
    enabled: Boolean(l1Tokens && address && publicClient),
    refetchInterval: (query) => (query.state.data && query.state.data.length > 0 ? INTERVAL.SECONDS_15 : false),
    queryFn: async () => {
      const haltedLockedTokens = (
        await Promise.all(
          l1Tokens!
            .filter((token) => token.raw.bridgeDisabled)
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

      return haltedLockedTokens as TokenData[];
    }
  });
};

export { useHaltedLockedTokens };
