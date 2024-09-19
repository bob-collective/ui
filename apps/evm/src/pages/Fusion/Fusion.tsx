import { useAccount } from '@gobob/wagmi';
import { useLocalStorage } from '@uidotdev/usehooks';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Geoblock, Main } from '../../components';
import { LocalStorageKey } from '../../constants';
import { useGetUser } from '../../hooks';
import { useGetApps } from '../Apps/hooks';

import { Challenges, CommunityVoting, Leaderboard, Strategies, UserInfo, WelcomeModal } from './components';
import { useGetQuests } from './hooks';

const Fusion = () => {
  const { address } = useAccount();
  const { data: user } = useGetUser();
  const { data: apps } = useGetApps();
  const { data: quests } = useGetQuests();

  const location = useLocation();

  const [isHideFusionWelcomeModal, setHideFusionWelcomeModal] = useLocalStorage<boolean>(
    LocalStorageKey.HIDE_FUSION_WELCOME_MODAL
  );

  useEffect(() => {
    if (location.state?.scrollChallenges) {
      document.getElementById('challenges')?.scrollIntoView?.({ behavior: 'smooth' });
    }
  }, [location]);

  const isAuthenticated = Boolean(user && address);

  return (
    <Geoblock>
      <Main maxWidth='7xl' padding='lg'>
        {/* <SeasonInfo /> */}
        <UserInfo apps={apps} isAuthenticated={isAuthenticated} quests={quests} user={user} />
        <Strategies />
        <Challenges quests={quests} />
        <CommunityVoting />
        <Leaderboard />
        {user && (
          <WelcomeModal
            isOpen={!isHideFusionWelcomeModal && isAuthenticated}
            user={user}
            onClose={() => setHideFusionWelcomeModal(true)}
          />
        )}
      </Main>
    </Geoblock>
  );
};

export { Fusion };
