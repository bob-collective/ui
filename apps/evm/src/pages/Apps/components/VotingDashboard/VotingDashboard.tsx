import { Flex, Link, P } from '@gobob/ui';

import { VotingAppData, VotingAppsData } from '../../hooks';

import { AppsLeaderboard } from './AppsLeaderboard';
import { UserVotingInfo } from './UserVotingInfo';

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
  const categories = apps?.categories.slice(0, 3) || [undefined, undefined, undefined];

  return (
    <Flex direction='column' gap='2xl' marginTop='3xl'>
      <Flex alignItems='center' direction='column' gap='2xl' justifyContent='space-between'>
        <UserVotingInfo
          isAuthenticated={isAuthenticated}
          roundEndsAt={apps?.roundEndsAt}
          votesRemaining={apps?.votesRemaining}
        />
        <P align='center' color='grey-50' size={{ base: 'xs', s: 's' }}>
          You can show your support for your favorite projects by clicking on the Flame icon. The more votes a project
          receives, the more Spice it earns. Cast your votes, back your preferred dapps, and reap more Spice!{' '}
          <Link color='inherit' href='#' size='inherit' underlined='always' onPress={() => alert('to be implemented')}>
            View Rules {'>'}
          </Link>
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
