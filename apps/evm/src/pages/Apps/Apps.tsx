import { useAccount } from '@gobob/wagmi';

import { Main } from '../../components';
import { useGetUser } from '../../hooks';

import { AppsList, AppsPodyum, HeroBanner, VotingDashboard } from './components';
import { useGetApps, useGetVotingApps, useVote, VotingAppData } from './hooks';
import { useGetPodyumData } from './hooks/useGetPodyumData';

const Apps = () => {
  const { data: votingAppsData, isLoading: isLoadingVotingApps } = useGetVotingApps();

  const { data: apps, isLoading: isLoadingApps } = useGetApps();

  const { data: podyumApps, isLoading: isLoadingPodyumApps } = useGetPodyumData();

  const { mutate: vote } = useVote();

  const { address } = useAccount();
  const { data: user } = useGetUser();

  const handleVote = (app: VotingAppData) => {
    vote({ refCode: app.refCode, isRetract: app.userHasVotedFor });
  };

  const isAuthenticated = Boolean(user && address);

  const hasPodyum = !isLoadingPodyumApps && !!podyumApps?.length;

  return (
    <>
      <Main maxWidth='7xl' padding='lg'>
        <HeroBanner />
        <VotingDashboard
          apps={votingAppsData}
          isAuthenticated={isAuthenticated}
          isLoading={isLoadingVotingApps}
          isVotingDisabled={!user}
          isVotingExceeded={votingAppsData && votingAppsData.votesRemaining <= 0}
          onVote={handleVote}
        />
        {hasPodyum && <AppsPodyum apps={podyumApps} isLoading={isLoadingPodyumApps} />}
        <AppsList
          apps={apps}
          isAuthenticated={isAuthenticated}
          isLoading={isLoadingApps}
          isVotingDisabled={!user}
          isVotingExceeded={votingAppsData && votingAppsData.votesRemaining <= 0}
          onVote={handleVote}
        />
      </Main>
    </>
  );
};

export { Apps };
