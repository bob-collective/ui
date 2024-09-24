import { useAccount } from '@gobob/wagmi';
import { useLocalStorage } from '@uidotdev/usehooks';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Flex, H1, Link, P } from '@gobob/ui';

import { Geoblock, Main } from '../../components';
import { LocalStorageKey } from '../../constants';
import { useGetUser } from '../../hooks';
import { useGetApps } from '../Apps/hooks';

import {
  Challenges,
  CommunityVoting,
  Leaderboard,
  Strategies,
  UserInfo,
  WelcomeBackModal,
  WelcomeModal
} from './components';
import { useGetQuests } from './hooks';

const Fusion = () => {
  const { address } = useAccount();
  const { data: user } = useGetUser();
  const { data: apps } = useGetApps();
  const { data: quests } = useGetQuests();

  const location = useLocation();

  const [isHideFusionWelcomeBackModal, setHideFusionWelcomeBackModal] = useLocalStorage<boolean>(
    LocalStorageKey.HIDE_FUSION_WELCOME_BACK_MODAL
  );

  const [isHideFusionWelcomeModal, setHideFusionWelcomeModal] = useLocalStorage<boolean>(
    LocalStorageKey.HIDE_FUSION_WELCOME_MODAL
  );

  const [isFusionWelcomeModalOpen, setFusionWelcomeModalOpen] = useState(!isHideFusionWelcomeModal);

  useEffect(() => {
    if (location.state?.scrollChallenges) {
      document.getElementById('challenges')?.scrollIntoView?.({ behavior: 'smooth' });
    }
  }, [location]);

  const isAuthenticated = Boolean(user && address);
  const hasPastHarvest = user?.leaderboardRank && user.leaderboardRank.total_points > 0;

  return (
    <Geoblock>
      <Main maxWidth='7xl' padding='lg'>
        <Flex direction='column' gap='lg'>
          <H1 size='4xl'>BOB Fusion: The Final Season</H1>
          <P color='grey-50'>
            Harvest Spice by depositing into BOB apps, voting, and solving challenges. Keep an eye out for special
            events.{' '}
            <Link
              color='light'
              size='inherit'
              underlined='always'
              {...{ href: 'https://blog.gobob.xyz/posts/bob-fusion-the-final-season', external: true }}
            >
              Learn More
            </Link>
          </P>
        </Flex>
        <UserInfo apps={apps} isAuthenticated={isAuthenticated} quests={quests} user={user} />
        <Strategies />
        <Challenges quests={quests} />
        <CommunityVoting />
        <Leaderboard />
        {user ? (
          hasPastHarvest ? (
            <WelcomeBackModal
              isOpen={!isHideFusionWelcomeBackModal && isAuthenticated}
              user={user}
              onClose={() => setHideFusionWelcomeBackModal(true)}
            />
          ) : (
            <WelcomeModal
              isOpen={isFusionWelcomeModalOpen && isAuthenticated}
              user={user}
              onClose={(hideAlways) => {
                if (hideAlways) {
                  setHideFusionWelcomeModal(true);
                }

                setFusionWelcomeModalOpen(false);
              }}
            />
          )
        ) : null}
      </Main>
    </Geoblock>
  );
};

export { Fusion };
