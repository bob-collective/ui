'use client';

import { INTERVAL, UseQueryOptions, useQuery } from '@gobob/react-query';
import { useAccount } from '@gobob/wagmi';

import { UserResponse, apiClient } from '../utils';

import { FetchError } from '@/types/fetch';
import { fusionKeys } from '@/lib/react-query';

const useGetUser = (
  props: Omit<
    UseQueryOptions<UserResponse | undefined, unknown, UserResponse | undefined, string[]>,
    'queryKey' | 'queryFn' | 'refetchInterval'
  > = {}
) => {
  const { address } = useAccount();

  const enabled = Boolean(address && (props?.enabled !== undefined ? props.enabled : true));

  return useQuery({
    ...props,
    enabled,
    queryKey: fusionKeys.user(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    queryFn: () => apiClient.getMe(),
    staleTime: INTERVAL.MINUTE,
    gcTime: INTERVAL.MINUTE * 5,
    refetchInterval: (query) =>
      query.state.error instanceof FetchError && query.state.error.status === 401 ? undefined : INTERVAL.SECONDS_30
  });
};

export { useGetUser };
