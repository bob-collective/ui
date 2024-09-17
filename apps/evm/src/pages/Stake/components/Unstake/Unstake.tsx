import { Flex, P } from '@gobob/ui';

import { ExternalBridges, ExternalStakeCard } from './ExternalStakeCard';

type UnstakeProps = {
  type: 'stake' | 'unstake';
};

const defaultBridges: ExternalBridges[] = ['solvbtc', 'unibtc', 'pell-network'];

const Unstake = ({ type }: UnstakeProps): JSX.Element => {
  const bridges = defaultBridges;

  return (
    <Flex direction='column' gap='xl'>
      <P color='grey-50'>
        Native BTC unstaking will be available soon. In the meantime, please unstake your balance using the link
        corresponding to your original deposit:
      </P>
      <Flex direction='column' gap='md'>
        {bridges.map((bridge) => (
          <ExternalStakeCard key={bridge} bridge={bridge} type={type} />
        ))}
      </Flex>
    </Flex>
  );
};

export { Unstake };
