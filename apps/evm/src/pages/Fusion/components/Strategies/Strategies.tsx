import { Flex, H2 } from '@gobob/ui';

import { StrategyCard, StrategyCardProps } from './StrategyCard';

const btcLstLendingStrat: StrategyCardProps = {
  title: 'BTC LST Lending',
  shortDescription: 'Supply your BTC LSTs into a lending market on BOB',
  longDescription:
    'Deposit your BTC LSTs into a lending market on BOB and use them as collateral to borrow other assets.'
};

const strategies = [btcLstLendingStrat, btcLstLendingStrat, btcLstLendingStrat];

type StrategiesProps = {};

const Strategies = ({}: StrategiesProps) => {
  return (
    <Flex direction='column' gap='3xl' marginTop='8xl'>
      <H2 size='3xl'>Hot Strategies</H2>
      <Flex direction={{ base: 'column', md: 'row' }} gap='2xl'>
        {strategies.map((strat, idx) => (
          <StrategyCard key={idx} {...strat} />
        ))}
      </Flex>
    </Flex>
  );
};

export { Strategies };
