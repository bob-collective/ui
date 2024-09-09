import { useAccount } from '@gobob/wagmi';

import { Geoblock, Main } from '../../components';
import { useGetUser } from '../../hooks';
import { useGetApps } from '../Apps/hooks';

import { Challenges, SeasonInfo, UserInfo } from './components';
import { StyledBackground, StyledBackgroundOpacity } from './Fusion.style';
import { Leaderboard } from './components';

const Fusion = () => {
  const { address } = useAccount();
  const { data: user } = useGetUser();
  const { data: apps } = useGetApps();

  const isAuthenticated = Boolean(user && address);

  return (
    <Geoblock>
      <StyledBackground />
      <StyledBackgroundOpacity />
      <Main maxWidth='7xl' padding='lg'>
        <SeasonInfo />
        <UserInfo apps={apps} isAuthenticated={isAuthenticated} user={user} />
        <Challenges />
        <Leaderboard />
      </Main>
    </Geoblock>
  );
};

export { Fusion };
