import { Flex, P } from '@gobob/ui';
import { ChainId } from '@gobob/chains';

import { ExternalStakeCard, ExternalBridges } from './ExternalStakeCard';

type UnstakeProps = {
  type: 'stake' | 'unstake';
  chain: ChainId | 'BTC';
};

const defaultBridges: ExternalBridges[] = ['meson', 'orbiter-finance', 'owlto-finance', 'relay', 'stargate'];

const availableBridges: Partial<Record<ChainId | 'BTC', ExternalBridges[]>> = {
  [ChainId.MERLIN]: ['owlto-finance'],
  [ChainId.BITLAYER]: ['owlto-finance']
};

const UnstakeForm = ({ type, chain }: UnstakeProps): JSX.Element => {
  const bridges = availableBridges[chain] || defaultBridges;

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

export { UnstakeForm };
