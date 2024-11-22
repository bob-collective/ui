import { UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccountEffect, useDisconnect } from 'wagmi';

import { apiClient } from '../utils';

import { useGetUser } from './useGetUser';

const useLogout = (
  props: Omit<
    UseMutationOptions<
      void,
      unknown,
      | {
          shouldDisconnect?: boolean | undefined;
        }
      | undefined,
      unknown
    >,
    'mutationKey' | 'mutationFn'
  > = {}
) => {
  const { data: user } = useGetUser();

  const { disconnect } = useDisconnect();

  const queryClient = useQueryClient();

  const { mutate, mutateAsync, ...mutation } = useMutation({
    mutationKey: ['logout'],
    mutationFn: async ({ shouldDisconnect = true }: { shouldDisconnect?: boolean } = {}) => {
      await apiClient.logout();
      queryClient.removeQueries({ queryKey: ['user'] });
      if (shouldDisconnect) {
        disconnect();
      }
    },
    ...props
  });

  useAccountEffect({
    onDisconnect() {
      if (user) {
        mutate({ shouldDisconnect: false });
      }
    }
  });

  return {
    ...mutation,
    logout: mutate,
    logoutAsync: mutateAsync
  };
};

export { useLogout };
