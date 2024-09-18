import { Main } from '../../components';

import { BannerCarousel } from './components';
import { useGetStakingStrategies } from './hooks';
import { StakeContent } from './StakeContent';

enum Type {
  Stake = 'stake',
  Unstake = 'unstake'
}

const Stake = () => {
  const { data: strategies = [], isLoading: isStrategiesLoading } = useGetStakingStrategies();

  return (
    <Main maxWidth='5xl' padding='md'>
      <BannerCarousel />
      <StakeContent isLoading={isStrategiesLoading} strategies={strategies} />
    </Main>
  );
};

export { Stake, Type };
