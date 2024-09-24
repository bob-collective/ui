import { INTERVAL, useQuery } from '@gobob/react-query';

import { appsKeys } from '../../../lib/react-query';
import { apiClient, PartnerS3 } from '../../../utils';
import { useGetUser } from '../../../hooks';

import { useGetVotingApps, VotingAppData } from './useGetVotingApps';

function getImageUrl(name: string) {
  return new URL(`../../../assets/partners/${name.split(' ').join('').toLowerCase()}.png`, import.meta.url);
}

const fallbackImg = new URL(`../../../assets/spice-shape-background.jpg`, import.meta.url);

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
    queryFn: async () => apiClient.getSeason3Partners(),
    gcTime: INTERVAL.HOUR,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    select: (data): AppData[] => {
      const apps = votingApps?.categories.map((category) => category.apps).flat();

      return data.partners
        .filter((partner) => partner.live)
        .map((partner) => {
          const imageUrl = getImageUrl(partner.name);
          const hasImg = !imageUrl.href.endsWith('undefined');

          return {
            ...partner,
            logoSrc: hasImg ? imageUrl.href : fallbackImg.href,
            voting: apps?.find((app) => partner.ref_code === app.refCode),
            userHarvest: user?.season3Data.harvestedPointsS3.find(
              (project) => project.partner_refcode === partner.ref_code
            )?.total_points,
            multiplier:
              Number(partner.min_multiplier) > 0 || Number(partner.max_multiplier) > 0
                ? partner.min_multiplier === partner.max_multiplier
                  ? `${partner.max_multiplier}x`
                  : `${partner.min_multiplier}x - ${partner.max_multiplier}x`
                : '1x'
          };
        });
    }
  });
};

export { useGetApps };
export type { AppData };
