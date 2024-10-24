import { useMutation, UseMutationOptions, useQueryClient } from '@gobob/react-query';

import { fusionKeys } from '@/lib/react-query';
import { apiClient, LotteryRoll } from '@/utils';
import { useAccount } from '@gobob/wagmi';

const useLotteryRoll = (props: Omit<UseMutationOptions<LotteryRoll, Error, void, string[]>, 'mutationFn'> = {}) => {
  const { address } = useAccount();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: fusionKeys.lotteryRoll(address),
    mutationFn: () => apiClient.lotteryRoll(),
    onSuccess: (data) => {
      queryClient.setQueryData(fusionKeys.lotteryStats(address), data);
      queryClient.refetchQueries({ queryKey: fusionKeys.lotteryStats(address) });
    },
    ...props
  });
};

export { useLotteryRoll };
