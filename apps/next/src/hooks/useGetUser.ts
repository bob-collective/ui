import { INTERVAL, UseQueryOptions, useQuery } from '@gobob/react-query';
import { useAccount } from '@gobob/wagmi';

import { UserResponse, apiClient } from '../utils';

const useGetUser = (
  props: Omit<
    UseQueryOptions<UserResponse | undefined, unknown, UserResponse | undefined, string[]>,
    'queryKey' | 'enabled' | 'queryFn' | 'refetchInterval'
  > = {}
) => {
  const { address } = useAccount();

  return useQuery({
    ...props,
    queryKey: ['user'],
    enabled: !!address,
    queryFn: async () => {
      try {
        return apiClient.getMe() ?? undefined;
      } catch (e) {
        return undefined;
      }
    },
    refetchInterval: INTERVAL.SECONDS_30
  });
};

export { useGetUser };
