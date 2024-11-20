import { INTERVAL, useQuery } from '@gobob/react-query';
import { formatDistanceToNow } from 'date-fns';

const useTimeToNextDraw = () => {
  return useQuery({
    queryKey: ['lottery-time-to-next-draw'],
    queryFn: () => {
      const date = new Date();

      date.setUTCHours(24, 0, 0, 0);

      return formatDistanceToNow(date);
    },
    refetchInterval: INTERVAL.MINUTE
  });
};

export { useTimeToNextDraw };
