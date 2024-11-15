import { useQuery } from '@gobob/react-query';

import { getAppLogo } from '../utils';

import { apiClient, ResultProject, ResultProjectCategory, ResultProjectVotingInfo } from '@/utils';
import { appsKeys } from '@/lib/react-query';

type ResultVotingAppData = ResultProject & {
  logoSrc: string;
};

type ResultVotingAppCategory = ResultProjectCategory & {
  projects: ResultVotingAppData[];
};

type ResultVotingAppInfo = ResultProjectVotingInfo & {
  categories: ResultVotingAppCategory[];
};

const useGetPodiumData = () => {
  return useQuery({
    queryKey: appsKeys.appsResultVotes(),
    queryFn: () => apiClient.getLastVotingResults(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    select: (data): ResultVotingAppInfo => {
      return {
        categories: data.categories.map((category) => ({
          ...category,
          projects: category.projects.map((project) => ({
            ...project,
            logoSrc: getAppLogo(project.name, project.logos)
          }))
        }))
      };
    }
  });
};

export { useGetPodiumData };
export type { ResultVotingAppData, ResultVotingAppCategory, ResultVotingAppInfo };
