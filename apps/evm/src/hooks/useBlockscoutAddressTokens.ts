import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { INTERVAL } from '@/constants';
import { blockscoutClient } from '@/utils';
import { BlockscoutTokenInfo } from '@/utils/blockscout-client';

const useBlockscoutAddressTokens = <T>(
  props: Omit<
    UseQueryOptions<BlockscoutTokenInfo[], unknown, T | undefined, string[]>,
    'queryKey' | 'queryFn' | 'refetchInterval'
  > = {}
) => {
  const { address } = useAccount();

  return useQuery({
    enabled: Boolean(address),
    queryKey: ['blockscout-balances', address!],
    queryFn: () => blockscoutClient.getTokens(address!, ['ERC-20']),
    refetchInterval: INTERVAL.SECONDS_30,
    ...props
  });
};

export { useBlockscoutAddressTokens };
