import { Flex, useMediaQuery } from '@gobob/ui';
import { useTheme } from 'styled-components';

import { CategoryLeaderboard } from './CategoryLeaderboard';
import { UserVotingInfo } from './UserVotingInfo';
import { StyledViewRules } from './VotingDashboard.style';

const VotingDashboard = (): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('s'));

  const viewRules = (
    <StyledViewRules href='#' underlined='always' onPress={() => alert('to be implemented')}>
      View Rules {'>'}
    </StyledViewRules>
  );

  return (
    <Flex direction='column' gap='2xl'>
      <Flex alignItems='center' justifyContent='space-between'>
        <UserVotingInfo />
        {!isMobile && viewRules}
      </Flex>
      <Flex direction={{ base: 'column', md: 'row' }} gap='xl'>
        <CategoryLeaderboard
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
        <CategoryLeaderboard
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
        <CategoryLeaderboard
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
