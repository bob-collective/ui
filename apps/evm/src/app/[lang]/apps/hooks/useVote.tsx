import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { useGetUser } from '@/hooks';
import { appsKeys, fusionKeys } from '@/lib/react-query';
import { apiClient } from '@/utils';

const useVote = () => {
  const queryClient = useQueryClient();
  const { data: user } = useGetUser();

  const { address } = useAccount();

  return useMutation({
    mutationKey: appsKeys.vote(address),
    mutationFn: async ({ isRetract, refCode }: { refCode: string; isRetract: boolean }) => {
      if (isRetract) {
        return apiClient.retractVote(refCode);
      }

      return apiClient.vote(refCode);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(appsKeys.appsVotes(user?.username), data);
      queryClient.resetQueries({ queryKey: fusionKeys.lotteryStats(user?.username) });
    }
  });
};

export { useVote };
