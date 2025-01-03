import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';

import { getLocale } from '@/utils';
import { INTERVAL } from '@/constants';
import { fusionKeys } from '@/lib/react-query';

const useTimeToNextDraw = (lang: 'en' | 'zh' = 'en') => {
  return useQuery({
    queryKey: fusionKeys.lotteryTimeToNextDraw(),
    queryFn: () => {
      const date = new Date();

      date.setUTCHours(24, 0, 0, 0);

      return formatDistanceToNow(date, { locale: getLocale(lang as Parameters<typeof getLocale>[0]) });
    },
    refetchInterval: INTERVAL.MINUTE
  });
};

export { useTimeToNextDraw };
