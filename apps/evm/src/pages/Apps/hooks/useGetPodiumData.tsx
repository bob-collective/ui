import { useQuery } from '@gobob/react-query';

import { appsKeys } from '../../../lib/react-query';
import { apiClient } from '../../../utils';

const useGetPodiumData = () => {
  return useQuery({
    queryKey: appsKeys.appsResultVotes(),
    queryFn: async () => apiClient.getLastVotingResults(),
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });
};

export { useGetPodiumData };
