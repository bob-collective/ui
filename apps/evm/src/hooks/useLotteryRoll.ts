import { useMutation, UseMutationOptions, useQueryClient } from '@gobob/react-query';

import { fusionKeys } from '@/lib/react-query';
import { apiClient, LotteryRoll } from '@/utils';
import { Address } from 'viem';

const useLotteryRoll = (
  address: Address | undefined,
  props: Omit<UseMutationOptions<LotteryRoll, Error, void, string[]>, 'mutationFn'> = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.lotteryRoll(),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: fusionKeys.lotteryStats(address) });
    },
    ...props
  });
};

export { useLotteryRoll };
