import { Main } from '../../components';

import { AppsList, AppsPodyum, HeroBanner, VotingDashboard } from './components';

const Apps = () => {
  return (
    <>
      <Main maxWidth='7xl' padding='lg'>
        <HeroBanner />
        <VotingDashboard />
        <AppsPodyum
          apps={[
            { name: 'Velodrome', imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png' },
            { name: 'Velodrome', imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png' },
            { name: 'Velodrome', imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png' }
          ]}
        />
        <AppsList />
      </Main>
    </>
  );
};

export { Apps };
