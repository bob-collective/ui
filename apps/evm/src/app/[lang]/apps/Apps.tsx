'use client';

import { useAccount } from 'wagmi';

import { AppsList, AppsPodium, HeroBanner, VotingDashboard } from './components';
import { useGetApps, useGetVotingApps, useVote, VotingAppData } from './hooks';
import { useGetPodiumData } from './hooks/useGetPodiumData';

import { Main } from '@/components';
import { useGetUser } from '@/hooks';

interface Props {
  searchParams?: { category: string };
}

const Apps = ({ searchParams }: Props) => {
  const { data: votingAppsData, isLoading: isLoadingVotingApps } = useGetVotingApps();

  const { data: apps, isLoading: isLoadingApps } = useGetApps();

  const { data: podiumResults } = useGetPodiumData();

  const { mutate: vote } = useVote();

  const { address } = useAccount();
  const { data: user } = useGetUser();

  const handleVote = (app: VotingAppData) => {
    vote({ refCode: app.refCode, isRetract: app.userHasVotedFor });
  };

  const isAuthenticated = Boolean(user && address);

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
        <AppsPodium results={podiumResults} />
        <AppsList
          apps={apps}
          isAuthenticated={isAuthenticated}
          isLoading={isLoadingApps}
          isVotingDisabled={!user}
          isVotingExceeded={votingAppsData && votingAppsData.votesRemaining <= 0}
          searchParams={searchParams}
          onVote={handleVote}
        />
      </Main>
    </>
  );
};

export { Apps };
