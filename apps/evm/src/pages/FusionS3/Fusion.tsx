import { useAccount } from '@gobob/wagmi';

import { Geoblock, Main } from '../../components';
import { useGetUser } from '../../hooks';

import { Challenges, SeasonInfo, UserInfo } from './components';
import { StyledBackground, StyledBackgroundOpacity } from './Fusion.style';
import { Leaderboard } from './components';

const Fusion = () => {
  const { address } = useAccount();
  const { data: user } = useGetUser();

  const isAuthenticated = Boolean(user && address);

  return (
    <Geoblock>
      <StyledBackground />
      <StyledBackgroundOpacity />
      <Main maxWidth='7xl' padding='lg'>
        <SeasonInfo />
        <UserInfo isAuthenticated={isAuthenticated} />
        <Challenges />
        <Leaderboard />
      </Main>
    </Geoblock>
  );
};

export { Fusion };
