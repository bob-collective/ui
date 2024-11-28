import { useMutation, useQueryClient } from '@gobob/react-query';
import { useDisconnect } from '@gobob/wagmi';
import { useAccountEffect } from '@gobob/wagmi';

import { apiClient } from '../utils';

import { useGetUser } from './useGetUser';

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
