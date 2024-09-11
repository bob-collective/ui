import { useAccount } from '@gobob/wagmi';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import { Geoblock, Main } from '../../components';
import { useGetUser } from '../../hooks';
import { useGetApps } from '../Apps/hooks';

import { Challenges, SeasonInfo, UserInfo } from './components';
import { StyledBackground, StyledBackgroundOpacity } from './Fusion.style';
import { Leaderboard } from './components';
import { useGetQuests } from './hooks';

const Fusion = () => {
  const { address } = useAccount();
  const { data: user } = useGetUser();
  const { data: apps } = useGetApps();
  const { data: quests } = useGetQuests();

  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollChallenges) {
      document.getElementById('challenges')?.scrollIntoView?.({ behavior: 'smooth' });
    }
  }, [location]);

  const isAuthenticated = Boolean(user && address);

  return (
    <Geoblock>
      <StyledBackground />
      <StyledBackgroundOpacity />
      <Main maxWidth='7xl' padding='lg'>
        <SeasonInfo />
        <UserInfo apps={apps} isAuthenticated={isAuthenticated} quests={quests} user={user} />
        <Challenges quests={quests} />
        <Leaderboard />
      </Main>
    </Geoblock>
  );
};

export { Fusion };
