import { INTERVAL, useQuery } from '@gobob/react-query';

import { fusionKeys } from '@/lib/react-query';
import { apiClient } from '@/utils';

const useGetQuests = () => {
  return useQuery({
    queryKey: fusionKeys.quests(),
    queryFn: () => apiClient.getQuestsS3(),
    gcTime: INTERVAL.HOUR,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });
};

export { useGetQuests };
