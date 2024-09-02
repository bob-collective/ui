import { Geoblock, Main } from '../../components';

import { SeasonInfo, UserInfo } from './components';
import { StyledBackground, StyledBackgroundOpacity } from './Fusion.style';

const Fusion = () => {
  return (
    <Geoblock>
      <StyledBackground />
      <StyledBackgroundOpacity />
      <Main maxWidth='7xl'>
        <SeasonInfo />
        <UserInfo />
      </Main>
    </Geoblock>
  );
};

export { Fusion };
