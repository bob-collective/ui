import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { useGetUser } from './useGetUser';

import { fusionKeys } from '@/lib/react-query';
import { apiClient, LotteryStats } from '@/utils';

const useLotteryStats = (
  props: Omit<
    UseQueryOptions<LotteryStats, Error, LotteryStats, string[]>,
    'queryKey' | 'queryFn' | 'refetchInterval' | 'enabled'
  > = {}
) => {
  const { address } = useAccount();
  const { data: user } = useGetUser();

  return useQuery({
    queryKey: fusionKeys.lotteryStats(user?.username),
    queryFn: () => apiClient.getLotteryStats(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(user && address),
    ...props
  });
};

export { useLotteryStats };
