import { useAccount } from '@gobob/wagmi';

import { Main } from '../../components';
import { useGetUser } from '../../hooks';

import { AppsList, AppsPodium, HeroBanner, VotingDashboard } from './components';
import { useGetApps, useGetVotingApps, useVote, VotingAppData } from './hooks';
import { useGetPodiumData } from './hooks/useGetPodiumData';

const Apps = () => {
  const { data: votingAppsData, isLoading: isLoadingVotingApps } = useGetVotingApps();

  const { data: apps, isLoading: isLoadingApps } = useGetApps();

  const { data: podiumApps, isLoading: isLoadingPodiumApps } = useGetPodiumData();

  const { mutate: vote } = useVote();

  const { address } = useAccount();
  const { data: user } = useGetUser();

  const handleVote = (app: VotingAppData) => {
    vote({ refCode: app.refCode, isRetract: app.userHasVotedFor });
  };

  const isAuthenticated = Boolean(user && address);

  const hasPodium = !isLoadingPodiumApps && !!podiumApps?.length;

  const podiumAppss = {
    categories: [
      {
        id: 1,
        name: 'BTC yield',
        projects: [
          {
            name: 'Sovryn',
            weight: 500,
            rank: 1,
            refCode: 'bfflwe',
            prizePoints: 100
          },
          {
            name: 'AAVE',
            weight: 300,
            rank: 2,
            refCode: 'b40jxz',
            prizePoints: 50
          }
        ]
      },
      {
        id: 2,
        name: 'Stablecoin',
        projects: [
          {
            name: 'AAVE',
            weight: 300,
            rank: 1,
            refCode: 'b40jxz',
            prizePoints: 20
          },
          {
            name: 'Curve',
            weight: 200,
            rank: 2,
            refCode: 'cur94z',
            prizePoints: 10
          }
        ]
      },
      {
        id: 3,
        name: 'Newcomers',
        projects: [
          {
            name: 'Curve',
            weight: 200,
            rank: 1,
            refCode: 'cur94z',
            prizePoints: 3
          },
          {
            name: 'Curve',
            weight: 200,
            rank: 2,
            refCode: 'cur94z',
            prizePoints: 3
          },
          {
            name: 'Curve',
            weight: 200,
            rank: 3,
            refCode: 'cur94z',
            prizePoints: 3
          }
        ]
      }
    ]
  };

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
        <AppsPodium apps={[]} isLoading={isLoadingPodiumApps} />
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
