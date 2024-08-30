import { Main } from '../../components';

import { AppsList, AppsPodyum, HeroBanner, VotingDashboard } from './components';
import { AppData, useGetApps, useVote } from './hooks';

const Apps = () => {
  const { data: apps, isLoading: isLoadingApps } = useGetApps();

  const { mutate: vote } = useVote();

  const handleVote = (app: AppData) => {
    vote({ refCode: app.refCode, isRetract: app.userHasVotedFor });
  };

  return (
    <>
      <Main maxWidth='7xl' padding='lg'>
        <HeroBanner />
        <VotingDashboard apps={apps} isLoading={isLoadingApps} onVote={handleVote} />
        <AppsPodyum
          apps={[
            { name: 'Velodrome', imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png' },
            { name: 'Velodrome', imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png' },
            { name: 'Velodrome', imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png' }
          ]}
        />
        <AppsList />
      </Main>
    </>
  );
};

export { Apps };
