import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { blockscoutClient } from '@/utils';
import { BlockscoutTokenInfo } from '@/utils/blockscout-client';
import { INTERVAL } from '@/constants';

const useBlockscoutBalances = <T>(
  props: Omit<
    UseQueryOptions<BlockscoutTokenInfo[], unknown, T | undefined, string[]>,
    'queryKey' | 'queryFn' | 'refetchInterval'
  > = {}
) => {
  const { address } = useAccount();

  return useQuery({
    queryKey: ['blockscout-balances', address!],
    queryFn: () => blockscoutClient.getTokens(address!, ['ERC-20']),
    refetchInterval: INTERVAL.SECONDS_30,
    ...props
  });
};

export { useBlockscoutBalances };
