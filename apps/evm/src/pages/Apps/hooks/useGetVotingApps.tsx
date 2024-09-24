import { INTERVAL, useQuery } from '@gobob/react-query';
import { useAccount } from '@gobob/wagmi';

import { appsKeys } from '../../../lib/react-query';
import { apiClient, Project, ProjectCategory, ProjectVotingInfo } from '../../../utils';

function getImageUrl(name: string) {
  return new URL(`../../../assets/partners/${name.split(' ').join('').toLowerCase()}.png`, import.meta.url);
}

const fallbackImg = new URL(`../../../assets/spice-shape-background.jpg`, import.meta.url);

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
            const imageUrl = getImageUrl(project.name);
            const hasImg = !imageUrl.href.endsWith('undefined');

            return {
              ...project,
              logoSrc: hasImg ? getImageUrl(project.name).href : fallbackImg.href
            };
          })
        }))
      };
    }
  });
};

export { useGetVotingApps };
export type { VotingAppsData, VotingAppData };
