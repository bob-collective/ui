import { INTERVAL, useQuery } from '@gobob/react-query';

import { getAppLogo } from '../utils';

import { apiClient, Project, ProjectCategory, ProjectVotingInfo } from '@/utils';
import { appsKeys } from '@/lib/react-query';
import { useGetUser } from '@/hooks';

type VotingAppData = Project & {
  logoSrc: string;
};

type VotingAppCategoryData = Omit<ProjectCategory, 'projects'> & { apps: VotingAppData[] };

type VotingAppsData = Omit<ProjectVotingInfo, 'categories'> & { categories: VotingAppCategoryData[] };

const useGetVotingApps = () => {
  const { data } = useGetUser();

  return useQuery({
    queryKey: appsKeys.appsVotes(data?.username),
    queryFn: () => apiClient.getVotes(),
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
