import { useQuery, UseQueryOptions } from '@gobob/react-query';
import { Address } from 'viem';

import { fusionKeys } from '@/lib/react-query';
import { apiClient, LotteryStats } from '@/utils';

const useLotteryStats = (
  address: Address | undefined,
  props: Omit<
    UseQueryOptions<LotteryStats, Error, LotteryStats, string[]>,
    'queryKey' | 'queryFn' | 'refetchInterval' | 'enabled'
  > = {}
) => {
  return useQuery({
    queryKey: fusionKeys.lotteryStats(address),
    queryFn: () => apiClient.getLotteryStats(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(address),
    ...props
  });
};

export { useLotteryStats };
