import { Flex, P } from '@gobob/ui';

import { ExternalBridge, ExternalStakeCard } from './ExternalStakeCard';

type BridgeType = 'LST' | 'Restaking' | 'Lending';

const defaultBridges: Record<BridgeType, ExternalBridge[]> = {
  LST: ['solvbtc-bbn', 'unibtc'],
  Restaking: ['pell-network'],
  Lending: ['segment', 'shoebill']
};

const Unstake = (): JSX.Element => {
  const bridges = defaultBridges;

  return (
    <Flex direction='column' gap='xl'>
      <Flex direction='column' gap='xl'>
        {Object.entries(bridges).map(([bridgeType, bridges]) => {
          return bridges.length ? (
            <Flex key={bridgeType} direction='column' gap='md'>
              <P size='md'>{bridgeType}</P>
              {bridges.map((bridge) => (
                <ExternalStakeCard key={bridge} bridge={bridge} />
              ))}
            </Flex>
          ) : null;
        })}
      </Flex>
    </Flex>
  );
};

export { Unstake };
