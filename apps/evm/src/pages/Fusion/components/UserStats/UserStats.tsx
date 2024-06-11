import { Flex, Spinner } from '@gobob/ui';

import { useLockedTokens } from '../../hooks';

import { SeasonOne } from './SeasonOne';
import { SeasonTwo } from './SeasonTwo';

const UserStats = () => {
  const { data: lockedTokens, isLoading } = useLockedTokens();

  const isSeasonTwo = lockedTokens?.length === 0;

  if (isLoading) {
    return (
      <Flex alignItems='center' justifyContent='center' style={{ height: '100%', width: '100%' }}>
        <Spinner />
      </Flex>
    );
  }

  return <>{isSeasonTwo ? <SeasonTwo /> : <SeasonOne />}</>;
};

export { UserStats };
