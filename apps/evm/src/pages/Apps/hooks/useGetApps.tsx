import { useQuery } from '@gobob/react-query';

import { appsKeys } from '../../../lib/react-query';
import { apiClient, Partner } from '../../../utils';

function getImageUrl(name: string) {
  return new URL(`../../../assets/partners/${name.split(' ').join('').toLowerCase()}.png`, import.meta.url).href;
}

type AppData = Partner & {
  imgSrc: string;
};

const useGetApps = () => {
  return useQuery<AppData[]>({
    queryKey: appsKeys.partners(),
    queryFn: async () => {
      const data = await apiClient.getSeason3Partners();

      return data.partners.map((partner) => ({ ...partner, imgSrc: getImageUrl(partner.name) }));
    }
  });
};

export { useGetApps };
export type { AppData };
