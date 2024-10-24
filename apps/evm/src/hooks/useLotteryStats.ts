import { useQuery, UseQueryOptions } from '@gobob/react-query';

import { fusionKeys } from '@/lib/react-query';
import { apiClient, LotteryStats } from '@/utils';
import { useAccount } from '@gobob/wagmi';

const useLotteryStats = (
  props: Omit<
    UseQueryOptions<LotteryStats, Error, LotteryStats, string[]>,
    'queryKey' | 'queryFn' | 'refetchInterval' | 'enabled'
  > = {}
) => {
  const { address } = useAccount();

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
