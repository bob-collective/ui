import { useQuery } from '@gobob/react-query';

import { appsKeys } from '../../../lib/react-query';
import { apiClient, Project, ProjectCategory, ProjectVotingInfo } from '../../../utils';

function getImageUrl(name: string) {
  return new URL(`../../../assets/partners/${name.split(' ').join('').toLowerCase()}.png`, import.meta.url).href;
}

type AppData = Project & {
  logoSrc: string;
};

type AppCaregoryData = Omit<ProjectCategory, 'projects'> & { apps: AppData[] };

type AppsVotingInfoData = Omit<ProjectVotingInfo, 'categories'> & { categories: AppCaregoryData[] };

const useGetApps = () => {
  return useQuery({
    queryKey: appsKeys.apps(),
    queryFn: async () => apiClient.getVotes(),
    select: (data): AppsVotingInfoData => {
      return {
        ...data,
        categories: data.categories.map((category) => ({
          ...category,
          apps: category.projects.map((project): AppData => ({ ...project, logoSrc: getImageUrl(project.name) }))
        }))
      };
    }
  });
};

export { useGetApps };
export type { AppsVotingInfoData, AppData };
