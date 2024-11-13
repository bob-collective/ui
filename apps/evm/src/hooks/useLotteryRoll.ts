import { useRef } from 'react';
import { useMutation, UseMutationOptions, useQueryClient } from '@gobob/react-query';

import { useGetUser } from './useGetUser';

import { fusionKeys } from '@/lib/react-query';
import { apiClient, LotteryRoll } from '@/utils';

const useLotteryRoll = (props: Omit<UseMutationOptions<LotteryRoll, Error, void, string[]>, 'mutationFn'> = {}) => {
  const { data: user } = useGetUser();
  const queryClient = useQueryClient();
  const channel = useRef(new BroadcastChannel('fusion-lottery'));

  channel.current.onmessage = function (event) {
    event.preventDefault();
    queryClient.refetchQueries({ queryKey: fusionKeys.lotteryStats(user?.username) });
  };

  return useMutation({
    mutationKey: fusionKeys.lotteryRoll(user?.username),
    mutationFn: () => apiClient.lotteryRoll(),
    onSuccess: (data) => {
      queryClient.setQueryData(fusionKeys.lotteryStats(user?.username), data);
      queryClient.refetchQueries({ queryKey: fusionKeys.lotteryStats(user?.username) });
      channel.current.postMessage('');
      if (data.winningPackageId !== null) queryClient.refetchQueries({ queryKey: ['user'] });
    },
    ...props
  });
};

export { useLotteryRoll };
