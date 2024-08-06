import { Flex } from '@gobob/ui';

import { ExternalBridgeCard } from './ExternalBridgeCard';

type ExternalBridgeFormProps = {
  type: 'deposit' | 'withdraw';
};

const ExternalBridgeForm = ({ type }: ExternalBridgeFormProps): JSX.Element => {
  return (
    <Flex direction='column' gap='xl' marginTop='2xl'>
      <Flex direction='column' gap='md'>
        <ExternalBridgeCard bridge='relay' type={type} />
        <ExternalBridgeCard bridge='meson' type={type} />
        <ExternalBridgeCard bridge='orbiter-finance' type={type} />
        <ExternalBridgeCard bridge='owlto-finance' type={type} />
        <ExternalBridgeCard bridge='stargate' type={type} />
      </Flex>
    </Flex>
  );
};

export { ExternalBridgeForm };
