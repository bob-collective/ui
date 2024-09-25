import { Flex, P } from '@gobob/ui';

import { VotingAppData, VotingAppsData } from '../../hooks';
import { UserVotingInfo } from '../UserVotingInfo';

import { AppsLeaderboard } from './AppsLeaderboard';

type VotingDashboardProps = {
  isLoading?: boolean;
  apps?: VotingAppsData;
  isVotingDisabled?: boolean;
  isAuthenticated?: boolean;
  isVotingExceeded?: boolean;
  onVote?: (app: VotingAppData) => void;
};

const VotingDashboard = ({
  apps,
  isLoading,
  isVotingDisabled,
  isVotingExceeded,
  isAuthenticated,
  onVote
}: VotingDashboardProps): JSX.Element => {
  const hasCategories = (apps?.categories.length || 0) >= 3;

  const categories = hasCategories ? apps?.categories.slice(0, 3) || [] : [undefined, undefined, undefined];

  return (
    <Flex direction='column' gap='2xl' marginTop='3xl'>
      <Flex alignItems='center' direction='column' gap='2xl' justifyContent='space-between'>
        <UserVotingInfo apps={apps} isAuthenticated={isAuthenticated} />
        <P align='center' color='grey-50' size={{ base: 'xs', s: 's' }}>
          Vote for maximum three projects per week by clicking on the flame icon.
        </P>
      </Flex>
      <Flex direction={{ base: 'column', md: 'row' }} gap='xl'>
        {categories.map((category, idx) => (
          <AppsLeaderboard
            key={idx}
            data={category?.apps}
            isLoading={isLoading}
            isVotingDisabled={isVotingDisabled}
            isVotingExceeded={isVotingExceeded}
            title={category?.name}
            onVote={onVote}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export { VotingDashboard };
