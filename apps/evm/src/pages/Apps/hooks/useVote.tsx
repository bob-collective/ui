import { useMutation, useQueryClient } from '@gobob/react-query';
import { useAccount } from '@gobob/wagmi';

import { appsKeys } from '../../../lib/react-query';
import { apiClient } from '../../../utils';

const useVote = () => {
  const queryClient = useQueryClient();

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
      queryClient.setQueryData(appsKeys.apps(), data);
    }
  });
};

export { useVote };
