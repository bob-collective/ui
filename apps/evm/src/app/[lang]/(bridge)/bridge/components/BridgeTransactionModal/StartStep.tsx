import { Button, CheckCircle, Flex, Link, P } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { Chain } from 'viem';

import { useBridge } from '../../hooks';
import { GasAmount } from '../GasAmount';

import { ChainLogo } from '@/components';

type StartStepProps = {
  chain: Chain;
  transactionHash?: string;
  isStarted: boolean;
  onPressStart: () => void;
} & Pick<ReturnType<typeof useBridge>, 'gasEstimate'>;

const StartStep = ({ chain, gasEstimate, transactionHash, isStarted, onPressStart }: StartStepProps) => (
  <Flex alignItems='center' gap='s' justifyContent='space-between' style={{ overflow: 'hidden', width: '100%' }}>
    <Flex alignItems='center' flex={1} gap='s' style={{ overflow: 'hidden' }}>
      <ChainLogo chainId={chain.id} size='xl' />
      <Flex direction='column' style={{ overflow: 'hidden' }}>
        <P size='s' weight='semibold'>
          <Trans>Start on {chain.name}</Trans>
        </P>
        {transactionHash ? (
          <Link external color='grey-50' href={`${chain.blockExplorers?.default.url}/tx/${transactionHash}`} size='s'>
            View transaction
          </Link>
        ) : (
          gasEstimate.data && <GasAmount amount={gasEstimate.data} />
        )}
      </Flex>
    </Flex>
    {transactionHash ? (
      <CheckCircle />
    ) : (
      <Button color='light' loading={isStarted} size='s' onPress={onPressStart}>
        <Trans>Start</Trans>
      </Button>
    )}
  </Flex>
);

export { StartStep };
