import { Main } from '../../components';

import { AppsList, VotingDashboard } from './components';

const Apps = () => {
  return (
    <>
      <Main maxWidth='7xl' padding='lg'>
        <VotingDashboard />
        <AppsList />
      </Main>
    </>
  );
};

export { Apps };
