import { FuelStation } from '@gobob/icons';
import { Button, Flex, Link, P } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { Chain } from 'viem';

import { useBridge } from '../../hooks';

import { AmountLabel, ChainLogo } from '@/components';
import { chainL1 } from '@/constants';
import { BridgeToken } from '@/hooks';

type ApprovalStepProps = {
  chain: Chain;
  selectedToken: BridgeToken;
} & Pick<ReturnType<typeof useBridge>, 'approval' | 'approvalGasEstimate'>;

const ApprovalStep = ({ chain, selectedToken, approval, approvalGasEstimate }: ApprovalStepProps) => (
  <Flex alignItems='center' gap='s' justifyContent='space-between'>
    <Flex alignItems='center' gap='s'>
      <ChainLogo chainId={chain.id} size='xl' />
      <Flex direction='column'>
        <P size='s' weight='semibold'>
          <Trans>Approve {selectedToken.l1Token.symbol}</Trans>
        </P>
        {approvalGasEstimate.data && (
          <Flex alignItems='center' gap='xs'>
            <FuelStation color='grey-50' size='xxs' />
            <P color='grey-50' size='s'>
              <AmountLabel amount={approvalGasEstimate.data} significantDigits={3} />
            </P>
          </Flex>
        )}
      </Flex>
    </Flex>
    {approval.approveResult ? (
      <Button asChild color='light'>
        <Link external href={`${chainL1.blockExplorers?.default.url}/tx/${approval.approveResult}`}>
          <Trans>View TX</Trans>
        </Link>
      </Button>
    ) : (
      <Button color='light' loading={approval.isApproving} size='s' onPress={approval.approve}>
        <Trans>Approve</Trans>
      </Button>
    )}
  </Flex>
);

export { ApprovalStep };
