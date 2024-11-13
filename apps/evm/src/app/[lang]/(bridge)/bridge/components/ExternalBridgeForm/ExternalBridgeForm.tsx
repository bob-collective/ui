import { ChainId } from '@gobob/chains';
import { Flex } from '@gobob/ui';

import { ExternalBridgeCard, ExternalBridges } from './ExternalBridgeCard';

import { TransactionDirection } from '@/types';

type ExternalBridgeFormProps = {
  direction: TransactionDirection;
  chain: ChainId | 'BTC';
};

const defaultBridges: ExternalBridges[] = [
  'meson',
  'orbiter-finance',
  'owlto-finance',
  'gas',
  'free',
  'fbtc',
  'relay',
  'superbridge'
];

const availableBridges: Partial<Record<ChainId | 'BTC', ExternalBridges[]>> = {
  [ChainId.MERLIN]: ['owlto-finance'],
  [ChainId.BITLAYER]: ['owlto-finance']
};

const ExternalBridgeForm = ({ direction, chain }: ExternalBridgeFormProps): JSX.Element => {
  const bridges = availableBridges[chain] || defaultBridges;

  return (
    <Flex direction='column' gap='xl' marginTop='2xl'>
      <Flex direction='column' gap='md'>
        {bridges.map((bridge) => (
          <ExternalBridgeCard key={bridge} bridge={bridge} direction={direction} />
        ))}
      </Flex>
    </Flex>
  );
};

export { ExternalBridgeForm };
