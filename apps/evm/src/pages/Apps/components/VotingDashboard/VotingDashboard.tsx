import { Flex, useMediaQuery } from '@gobob/ui';
import { useTheme } from 'styled-components';

import { VotingAppData, VotingAppsData } from '../../hooks';

import { AppsLeaderboard } from './AppsLeaderboard';
import { UserVotingInfo } from './UserVotingInfo';
import { StyledViewRules } from './VotingDashboard.style';

type VotingDashboardProps = {
  isLoading?: boolean;
  apps?: VotingAppsData;
  isVotingDisabled?: boolean;
  onVote?: (app: VotingAppData) => void;
};

const VotingDashboard = ({ apps, isLoading, isVotingDisabled, onVote }: VotingDashboardProps): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('s'));

  const viewRules = (
    <StyledViewRules href='#' underlined='always' onPress={() => alert('to be implemented')}>
      View Rules {'>'}
    </StyledViewRules>
  );

  const categories = apps?.categories.slice(0, 3) || [undefined, undefined, undefined];

  return (
    <Flex direction='column' gap='2xl' marginTop='3xl'>
      <Flex alignItems='center' justifyContent='space-between'>
        <UserVotingInfo roundEndsAt={apps?.roundEndsAt} votesRemaining={apps?.votesRemaining} />
        {!isMobile && viewRules}
      </Flex>
      <Flex direction={{ base: 'column', md: 'row' }} gap='xl'>
        {categories.map((category) => (
          <AppsLeaderboard
            key={category?.id}
            data={category?.apps}
            isLoading={isLoading}
            isVotingDisabled={isVotingDisabled}
            title={category?.name}
            onVote={onVote}
          />
        ))}
      </Flex>
      {isMobile && viewRules}
    </Flex>
  );
};

export { VotingDashboard };
