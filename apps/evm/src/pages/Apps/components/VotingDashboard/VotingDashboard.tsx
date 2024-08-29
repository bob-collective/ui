import { Flex, useMediaQuery } from '@gobob/ui';
import { useTheme } from 'styled-components';

import { AppData } from '../../hooks';

import { AppsLeaderboard } from './AppsLeaderboard';
import { UserVotingInfo } from './UserVotingInfo';
import { StyledViewRules } from './VotingDashboard.style';

type VotingDashboardProps = {
  isLoading?: boolean;
  apps?: AppData[];
};

const VotingDashboard = ({ apps, isLoading }: VotingDashboardProps): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('s'));

  const viewRules = (
    <StyledViewRules href='#' underlined='always' onPress={() => alert('to be implemented')}>
      View Rules {'>'}
    </StyledViewRules>
  );

  return (
    <Flex direction='column' gap='2xl' marginTop='3xl'>
      <Flex alignItems='center' justifyContent='space-between'>
        <UserVotingInfo />
        {!isMobile && viewRules}
      </Flex>
      <Flex direction={{ base: 'column', md: 'row' }} gap='xl'>
        <AppsLeaderboard
          isLoading
          data={[
            {
              imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png',
              name: 'Velodrome',
              votesCount: 200000000
            },
            {
              imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png',
              name: 'ChaineyeMiniBridge',
              votesCount: 20000000
            },
            { imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png', name: 'Velodrome', votesCount: 20000000 },
            { imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png', name: 'Velodrome', votesCount: 20000000 },
            { imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png', name: 'Velodrome', votesCount: 20000000 }
          ]}
          title='Defi Favourites'
        />
        <AppsLeaderboard
          data={[
            {
              imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png',
              name: 'Velodrome',
              votesCount: 200000000
            },
            {
              imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png',
              name: 'ChaineyeMiniBridge',
              votesCount: 20000000
            },
            { imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png', name: 'Velodrome', votesCount: 20000000 },
            { imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png', name: 'Velodrome', votesCount: 20000000 },
            { imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png', name: 'Velodrome', votesCount: 20000000 }
          ]}
          title='NFT Favourites'
        />
        <AppsLeaderboard
          data={[
            {
              imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png',
              name: 'Velodrome',
              votesCount: 200000000
            },
            {
              imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png',
              name: 'ChaineyeMiniBridge',
              votesCount: 20000000
            },
            { imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png', name: 'Velodrome', votesCount: 20000000 },
            { imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png', name: 'Velodrome', votesCount: 20000000 },
            { imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png', name: 'Velodrome', votesCount: 20000000 }
          ]}
          title='New Apps'
        />
      </Flex>
      {isMobile && viewRules}
    </Flex>
  );
};

export { VotingDashboard };
