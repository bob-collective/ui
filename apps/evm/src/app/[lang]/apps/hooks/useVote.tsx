import { useMutation, useQueryClient } from '@gobob/react-query';

import { appsKeys, fusionKeys } from '@/lib/react-query';
import { apiClient } from '@/utils';
import { useGetUser } from '@/hooks';

const useVote = () => {
  const queryClient = useQueryClient();
  const { data: user } = useGetUser();

  return useMutation({
    mutationKey: appsKeys.vote(user?.username),
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
