import { Flex, H2 } from '@gobob/ui';

import { StrategyCard } from './StrategyCard';

type StrategiesProps = {};

const Strategies = ({}: StrategiesProps) => {
  return (
    <Flex direction='column' gap='3xl' marginTop='8xl'>
      <H2 size='3xl'>Hot Strategies</H2>
      <Flex direction={{ base: 'column', md: 'row' }} gap='2xl'>
        <StrategyCard description='Supply your BTC LSTs into a lending market on BOB' title='BTC LST Lending' />
        <StrategyCard
          description='Mint satUSD and supply it into a lending market on BOB'
          title='Mint and Lend satUSD'
        />
        <StrategyCard description='Provide liquidity into Oku DEX' title='DEX Liquidity Provisioning' />
      </Flex>
    </Flex>
  );
};

export { Strategies };
