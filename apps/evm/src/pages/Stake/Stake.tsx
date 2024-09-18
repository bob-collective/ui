import { Main } from '../../components';
import { useGetStakeStrategies } from '../../hooks';

import { BannerCarousel } from './components';
import { StakeContent } from './StakeContent';

enum Type {
  Stake = 'stake',
  Unstake = 'unstake'
}

const Stake = () => {
  const { data: strategies = [], isLoading: isStrategiesLoading } = useGetStakeStrategies();

  return (
    <Main maxWidth='5xl' padding='md'>
      <BannerCarousel />
      <StakeContent isLoading={isStrategiesLoading} strategies={strategies} />
    </Main>
  );
};

export { Stake, Type };
