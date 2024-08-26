import { Main } from '../../components';

import { CategoryLeaderboard } from './components';

const Apps = () => {
  return (
    <>
      <Main maxWidth='5xl' padding='md'>
        <CategoryLeaderboard
          data={[
            { imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png', name: 'Velodrome', votesCount: 20000000 },
            { imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png', name: 'Velodrome', votesCount: 20000000 },
            { imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png', name: 'Velodrome', votesCount: 20000000 },
            { imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png', name: 'Velodrome', votesCount: 20000000 },
            { imgSrc: 'https://app.gobob.xyz/assets/velodrome-9314312b.png', name: 'Velodrome', votesCount: 20000000 }
          ]}
        />
      </Main>
    </>
  );
};

export { Apps };
