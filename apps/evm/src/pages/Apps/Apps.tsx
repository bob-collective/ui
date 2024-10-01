import { useAccount } from '@gobob/wagmi';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';

import { Main } from '../../components';
import { useGetUser } from '../../hooks';

import { AppsList, AppsPodium, HeroBanner, VotingDashboard, AppVotingIntentModal } from './components';
import { useGetApps, useGetVotingApps, useVote, VotingAppData } from './hooks';
import { useGetPodiumData } from './hooks';

const Apps = () => {
  const { data: votingAppsData, isLoading: isLoadingVotingApps } = useGetVotingApps();
  const { data: apps, isLoading: isLoadingApps } = useGetApps();
  const { data: podiumApps, isLoading: isLoadingPodiumApps } = useGetPodiumData();
  const { mutate: vote } = useVote();
  const { address } = useAccount();
  const { data: user } = useGetUser();

  const [searchParams] = useSearchParams(new URLSearchParams(window.location.search));
  const intentVote = searchParams.get('intentVote');
  const [isIntentVoteModalOpen, setIntentVoteModalOpen] = useState(!!intentVote);

  const handleVote = (app: VotingAppData) => {
    vote({ refCode: app.refCode, isRetract: app.userHasVotedFor });
  };

  const isAuthenticated = Boolean(user && address);

  const hasPodium = !isLoadingPodiumApps && !!podiumApps?.length;

  const intentVoteApp = apps?.find((app) => app.ref_code.toLowerCase() === intentVote?.toLowerCase() && !!app.voting);

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
        {hasPodium && <AppsPodium apps={podiumApps} isLoading={isLoadingPodiumApps} />}
        <AppsList
          apps={apps}
          isAuthenticated={isAuthenticated}
          isLoading={isLoadingApps}
          isVotingDisabled={!user}
          isVotingExceeded={votingAppsData && votingAppsData.votesRemaining <= 0}
          onVote={handleVote}
        />
        {intentVoteApp && (
          <AppVotingIntentModal
            app={intentVoteApp}
            apps={votingAppsData}
            isAuthenticated={isAuthenticated}
            isOpen={isIntentVoteModalOpen}
            isVotingDisabled={!user}
            isVotingExceeded={votingAppsData && votingAppsData.votesRemaining <= 0}
            onClose={() => setIntentVoteModalOpen(false)}
            onVote={handleVote}
          />
        )}
      </Main>
    </>
  );
};

export { Apps };
