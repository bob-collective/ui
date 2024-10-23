import { useQuery, UseQueryOptions } from '@gobob/react-query';
import { Address } from 'viem';
import { useState } from 'react';

import { fusionKeys } from '@/lib/react-query';
import { LotteryStats } from '@/utils';

const useLotteryStats = (
  address: Address | undefined,
  props: Omit<
    UseQueryOptions<LotteryStats, Error, LotteryStats, string[]>,
    'queryKey' | 'queryFn' | 'refetchInterval' | 'enabled'
  > = {}
) => {
  const [state, setState] = useState(3);

  return useQuery({
    queryKey: fusionKeys.lotteryStats(address),
    // queryFn: () => apiClient.getLotteryStats(),
    queryFn: async () => {
      setState((val) => val - 1);

      if (state === 0) {
        return {
          pointsMissing: 0,
          rollsRemaining: 0,
          running: true,
          votesRemaining: 2
        };
      }

      return {
        pointsMissing: 0,
        rollsRemaining: state,
        running: true,
        votesRemaining: 0
      };
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(address),
    ...props
  });
};

export { useLotteryStats };
