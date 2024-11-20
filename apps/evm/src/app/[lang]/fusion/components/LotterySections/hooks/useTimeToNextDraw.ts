import { INTERVAL, useQuery } from '@gobob/react-query';
import { formatDistanceToNow } from 'date-fns';

import { getLocale } from '@/utils';

const useTimeToNextDraw = (lang: 'en' | 'zh' = 'en') => {
  return useQuery({
    queryKey: ['lottery-time-to-next-draw'],
    queryFn: () => {
      const date = new Date();

      date.setUTCHours(24, 0, 0, 0);

      return formatDistanceToNow(date, { locale: getLocale(lang as Parameters<typeof getLocale>[0]) });
    },
    refetchInterval: INTERVAL.MINUTE
  });
};

export { useTimeToNextDraw };
