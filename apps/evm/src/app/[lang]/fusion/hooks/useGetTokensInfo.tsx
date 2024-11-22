import { useQuery } from '@tanstack/react-query';

import { INTERVAL } from '@/constants';
import { fusionKeys } from '@/lib/react-query';
import { apiClient } from '@/utils';

const useGetTokensInfo = ({ enabled }: { enabled?: boolean } = {}) => {
  return useQuery({
    enabled,
    queryKey: fusionKeys.tokenInfo(),
    queryFn: () => apiClient.getTokenInfo(),
    gcTime: INTERVAL.HOUR,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });
};

export { useGetTokensInfo };
