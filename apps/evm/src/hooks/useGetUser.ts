'use client';

import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { UserResponse, apiClient } from '../utils';

import { INTERVAL } from '@/constants';
import { fusionKeys } from '@/lib/react-query';
import { FetchError } from '@/types/fetch';

const useGetUser = (
  props: Omit<
    UseQueryOptions<UserResponse | undefined | null, unknown, UserResponse | undefined, string[]>,
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
    queryFn: async () => {
      try {
        // checks cookie set by siwe
        // it could be set but not yet verified by backend
        const result = await fetch('/api/fusion/check-cookie');
        const data = await result.json();

        return data.ok ? apiClient.getMe() : null;
      } catch (e) {}

      return apiClient.getMe();
    },
    staleTime: INTERVAL.MINUTE,
    gcTime: INTERVAL.MINUTE * 5,
    refetchInterval: (query) =>
      query.state.error instanceof FetchError && query.state.error.status === 401 ? undefined : INTERVAL.SECONDS_30
  });
};

export { useGetUser };
