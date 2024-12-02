import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccountEffect, useDisconnect } from 'wagmi';

import { useGetUser } from './useGetUser';

import { apiClient } from '@/utils';
import { fusionKeys } from '@/lib/react-query';

const useLogout = () => {
  const { data: user } = useGetUser();

  const { disconnect } = useDisconnect();

  const queryClient = useQueryClient();

  const { mutate, mutateAsync, ...mutation } = useMutation({
    mutationKey: ['logout'],
    mutationFn: async ({ shouldDisconnect = true }: { shouldDisconnect?: boolean } = {}) => {
      await apiClient.logout();
      queryClient.removeQueries({ queryKey: fusionKeys.user() });
      if (shouldDisconnect) {
        disconnect();
      }
    }
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
