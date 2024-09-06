import { INTERVAL, useQuery } from '@gobob/react-query';

import { fusionKeys } from '../../../lib/react-query';
import { apiClient } from '../../../utils';

const useGetTokensInfo = ({ enabled }: { enabled: boolean }) => {
  return useQuery({
    enabled,
    queryKey: fusionKeys.tokenInfo(),
    queryFn: async () => apiClient.getTokenInfo(),
    gcTime: INTERVAL.HOUR,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });
};

export { useGetTokensInfo };
