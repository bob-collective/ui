import { INTERVAL, useQuery } from '@gobob/react-query';

import { appsKeys } from '../../../lib/react-query';
import { apiClient, PartnerS3 } from '../../../utils';
import { useGetUser } from '../../../hooks';

import { useGetVotingApps, VotingAppData } from './useGetVotingApps';

function getImageUrl(name: string) {
  return new URL(`../../../assets/partners/${name.split(' ').join('').toLowerCase()}.png`, import.meta.url).href;
}

type AppData = PartnerS3 & {
  logoSrc: string;
  voting?: VotingAppData;
  userHarvest?: string;
};

const useGetApps = () => {
  const { data: votingApps } = useGetVotingApps();
  const { data: user } = useGetUser();

  return useQuery({
    queryKey: appsKeys.apps(),
    queryFn: async () => apiClient.getSeason3Partners(),
    gcTime: INTERVAL.HOUR,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    select: (data): AppData[] => {
      const apps = votingApps?.categories.map((category) => category.apps).flat();

      return data.partners.map((partner) => ({
        ...partner,
        logoSrc: getImageUrl(partner.name),
        voting: apps?.find((app) => partner.ref_code === app.refCode),
        userHarvest: user?.harvested.find((project) => project.partner_refcode === partner.ref_code)?.total_points
      }));
    }
  });
};

export { useGetApps };
export type { AppData };
