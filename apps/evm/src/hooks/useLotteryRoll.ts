import { useMutation, UseMutationOptions, useQueryClient } from '@gobob/react-query';
import { useAccount } from '@gobob/wagmi';

import { useGetUser } from './useGetUser';

import { fusionKeys } from '@/lib/react-query';
import { apiClient, LotteryRoll } from '@/utils';

const useLotteryRoll = (props: Omit<UseMutationOptions<LotteryRoll, Error, void, string[]>, 'mutationFn'> = {}) => {
  const { address } = useAccount();
  const { data: user } = useGetUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: fusionKeys.lotteryRoll(user?.username),
    mutationFn: () => apiClient.lotteryRoll(),
    onSuccess: (data) => {
      queryClient.setQueryData(fusionKeys.lotteryStats(address), data);
      queryClient.refetchQueries({ queryKey: fusionKeys.lotteryStats(user?.username) });
    },
    ...props
  });
};

export { useLotteryRoll };