import { INTERVAL, useQuery } from '@gobob/react-query';
import { useAccount } from '@gobob/wagmi';

import { appsKeys } from '../../../lib/react-query';
import { apiClient, Project, ProjectCategory, ProjectVotingInfo } from '../../../utils';
import { getAppLogo } from '../utils';

type VotingAppData = Project & {
  logoSrc: string;
};

type VotingAppCategoryData = Omit<ProjectCategory, 'projects'> & { apps: VotingAppData[] };

type VotingAppsData = Omit<ProjectVotingInfo, 'categories'> & { categories: VotingAppCategoryData[] };

const useGetVotingApps = () => {
  const { address } = useAccount();

  return useQuery({
    queryKey: appsKeys.appsVotes(address),
    queryFn: async () => apiClient.getVotes(),
    refetchInterval: INTERVAL.SECONDS_30,
    gcTime: INTERVAL.MINUTE,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    select: (data): VotingAppsData => {
      return {
        ...data,
        categories: data.categories.map((category) => ({
          ...category,
          apps: category.projects.map((project): VotingAppData => {
            return {
              ...project,
              logoSrc: getAppLogo(project.name, project.logos)
            };
          })
        }))
      };
    }
  });
};

export { useGetVotingApps };
export type { VotingAppsData, VotingAppData };
