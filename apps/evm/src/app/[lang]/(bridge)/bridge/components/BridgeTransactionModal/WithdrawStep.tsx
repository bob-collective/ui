import { Button, CheckCircle, Flex, P } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { Chain } from 'viem';
import { ETH } from '@gobob/icons';

type WithdrawStepProps = {
  type: 'prove' | 'finalize';
  toChain: Chain;
  isComplete: boolean;
  isPending: boolean;
  onPressStart: () => void;
};

const WithdrawStep = ({ type, toChain, isPending, isComplete, onPressStart }: WithdrawStepProps) => (
  <Flex alignItems='center' gap='s' justifyContent='space-between' style={{ overflow: 'hidden', width: '100%' }}>
    <Flex alignItems='center' flex={1} gap='s' style={{ overflow: 'hidden' }}>
      <ETH size='xl' />
      <Flex direction='column' style={{ overflow: 'hidden' }}>
        <P size='s' weight='semibold'>
          {type === 'finalize' ? <Trans>Get on {toChain.name}</Trans> : <Trans>Prove on {toChain.name}</Trans>}
        </P>
        {/* {transactionHash ? (
          <Link external color='grey-50' href={`${toChain.blockExplorers?.default.url}/tx/${transactionHash}`} size='s'>
            View transaction
          </Link>
        ) : (
          gasEstimate.data && <GasAmount amount={gasEstimate.data} />
        )} */}
      </Flex>
    </Flex>
    {isComplete ? (
      <CheckCircle />
    ) : (
      <Button color='light' loading={isPending} size='s' onPress={onPressStart}>
        {type === 'finalize' ? <Trans>Get</Trans> : <Trans>Prove</Trans>}
      </Button>
    )}
  </Flex>
);

export { WithdrawStep };
