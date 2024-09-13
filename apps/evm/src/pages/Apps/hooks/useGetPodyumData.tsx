import { useQuery } from '@gobob/react-query';

import { appsKeys } from '../../../lib/react-query';
import { apiClient, ResultProject } from '../../../utils';

function getImageUrl(name: string) {
  return new URL(`../../../assets/partners/${name.split(' ').join('').toLowerCase()}.png`, import.meta.url).href;
}

type ResultVotingAppData = ResultProject & {
  logoSrc: string;
};

const useGetPodyumData = () => {
  return useQuery({
    queryKey: appsKeys.appsResultVotes(),
    queryFn: async () => apiClient.getLastVotingResults(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    select: (data): [ResultVotingAppData, ResultVotingAppData, ResultVotingAppData] => {
      // Step 1: Combine all projects from all categories
      const allProjects = data.categories.flatMap((category) => category.projects);

      // Step 2: Sort the projects by weight in descending order
      const sortedProjects = allProjects.sort((a, b) => b.weight - a.weight);

      // Step 3: Filter unique projects by name using reduce
      const uniqueProjects = sortedProjects.reduce((accumulator, currentProject) => {
        // Check if the project name is already in the accumulator
        const isDuplicate = accumulator.some((project) => project.name === currentProject.name);

        if (!isDuplicate) {
          accumulator.push(currentProject);
        }

        return accumulator;
      }, [] as ResultProject[]);

      // Step 4: Get the top 3 unique projects
      const top3UniqueProjects = uniqueProjects.slice(0, 3) as [ResultProject, ResultProject, ResultProject];

      return top3UniqueProjects.map((project) => ({ ...project, logoSrc: getImageUrl(project.name) })) as [
        ResultVotingAppData,
        ResultVotingAppData,
        ResultVotingAppData
      ];
    }
  });
};

export { useGetPodyumData };
export type { ResultVotingAppData };
