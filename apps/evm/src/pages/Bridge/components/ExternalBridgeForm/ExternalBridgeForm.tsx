import { Flex } from '@gobob/ui';
import { ChainId } from '@gobob/chains';

import { ExternalBridgeCard, ExternalBridges } from './ExternalBridgeCard';

type ExternalBridgeFormProps = {
  type: 'deposit' | 'withdraw';
  chain: ChainId | 'BTC';
};

const defaultBridges: ExternalBridges[] = ['meson', 'orbiter-finance', 'owlto-finance', 'relay', 'stargate'];

const availableBridges: Partial<Record<ChainId | 'BTC', ExternalBridges[]>> = {
  [ChainId.MERLIN]: ['owlto-finance'],
  [ChainId.BITLAYER]: ['owlto-finance']
};

const ExternalBridgeForm = ({ type, chain }: ExternalBridgeFormProps): JSX.Element => {
  const bridges = availableBridges[chain] || defaultBridges;

  return (
    <Flex direction='column' gap='xl' marginTop='2xl'>
      <Flex direction='column' gap='md'>
        {bridges.map((bridge) => (
          <ExternalBridgeCard key={bridge} bridge={bridge} type={type} />
        ))}
      </Flex>
    </Flex>
  );
};

export { ExternalBridgeForm };
