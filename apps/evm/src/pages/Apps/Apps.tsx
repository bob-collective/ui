import { Main } from '../../components';
import { useGetUser } from '../../hooks';

import { AppsList, AppsPodyum, HeroBanner, VotingDashboard } from './components';
import { useGetApps, useGetVotingApps, useVote, VotingAppData } from './hooks';

const Apps = () => {
  const { data: votingAppsData, isLoading: isLoadingVotingApps } = useGetVotingApps();

  const { data: apps, isLoading: isLoadingApps } = useGetApps();

  const { mutate: vote } = useVote();

  const { data: user } = useGetUser();

  const handleVote = (app: VotingAppData) => {
    vote({ refCode: app.refCode, isRetract: app.userHasVotedFor });
  };

  return (
    <>
      <Main maxWidth='7xl' padding='lg'>
        <HeroBanner />
        <VotingDashboard
          apps={votingAppsData}
          isLoading={isLoadingVotingApps}
          isVotingDisabled={!user}
          onVote={handleVote}
        />
        <AppsPodyum
          apps={[
            { name: 'Velodrome', imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png' },
            { name: 'Velodrome', imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png' },
            { name: 'Velodrome', imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png' }
          ]}
        />
        {apps && <AppsList apps={apps} onVote={handleVote} />}
      </Main>
    </>
  );
};

export { Apps };
