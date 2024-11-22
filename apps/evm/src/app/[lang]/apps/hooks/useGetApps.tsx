import { useQuery } from '@tanstack/react-query';

import { getAppLogo } from '../utils';

import { useGetVotingApps, VotingAppData } from './useGetVotingApps';

import { INTERVAL } from '@/constants';
import { useGetUser } from '@/hooks';
import { appsKeys } from '@/lib/react-query';
import { apiClient, PartnerS3 } from '@/utils';

type AppData = PartnerS3 & {
  logoSrc: string;
  voting?: VotingAppData;
  userHarvest?: string;
  multiplier: string;
};

const useGetApps = () => {
  const { data: votingApps } = useGetVotingApps();
  const { data: user } = useGetUser();

  return useQuery({
    queryKey: appsKeys.apps(),
    queryFn: () => apiClient.getSeason3Partners(),
    gcTime: INTERVAL.HOUR,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    select: (data): AppData[] => {
      const apps = votingApps?.categories.map((category) => category.apps).flat();

      return data.partners
        .filter((partner) => partner.live)
        .map((partner) => {
          return {
            ...partner,
            logoSrc: getAppLogo(partner.name, partner.logos),
            voting: apps?.find((app) => partner.ref_code === app.refCode),
            userHarvest: user?.season3Data.harvestedPointsS3.find(
              (project) => project.partner_refcode === partner.ref_code
            )?.total_points,
            multiplier:
              Number(partner.min_multiplier) > 0 || Number(partner.max_multiplier) > 0
                ? partner.min_multiplier === partner.max_multiplier
                  ? `${Number(partner.max_multiplier) * 2}x`
                  : `${Number(partner.min_multiplier) * 2}x - ${Number(partner.max_multiplier) * 2}x`
                : '1x'
          };
        });
    }
  });
};

export { useGetApps };
export type { AppData };
