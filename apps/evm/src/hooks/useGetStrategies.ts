import { GatewayStrategyContract } from '@gobob/bob-sdk';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { INTERVAL } from '@/constants';
import { gatewaySDK } from '@/lib/bob-sdk';
import { bridgeKeys } from '@/lib/react-query';

const useGetStrategies = <T>(
  props: Omit<
    UseQueryOptions<GatewayStrategyContract[], unknown, T | undefined, string[]>,
    'queryKey' | 'queryFn' | 'refetchInterval'
  > = {}
) => {
  return useQuery({
    queryKey: bridgeKeys.strategies(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: INTERVAL.HOUR,
    queryFn: () => gatewaySDK.getStrategies(),
    ...props
  });
};

export { useGetStrategies };
