import { CurrencyAmount, Ether } from '@gobob/currency';
import { Card, Dd, Dl, DlGroup, Dt, Flex, Spinner } from '@gobob/ui';
import { Trans } from '@lingui/macro';

import { AmountLabel } from '@/components';
import { TransactionDirection } from '@/types';

type BridgeTransactionDetailsProps = {
  direction: TransactionDirection;
  gasEstimate?: CurrencyAmount<Ether>;
};

// TODO: refresh gas estimate
const BridgeTransactionDetails = ({ direction, gasEstimate }: BridgeTransactionDetailsProps) => (
  <Card background='grey-600' rounded='md'>
    <Dl direction='column' gap='none'>
      <DlGroup justifyContent='space-between'>
        <Dt color='grey-50' size='xs'>
          <Trans>Transfer time</Trans>
        </Dt>
        <Dd size='xs'>
          {direction === TransactionDirection.L1_TO_L2 ? <Trans>~3 min</Trans> : <Trans>~7 days</Trans>}
        </Dd>
      </DlGroup>

      {gasEstimate && (
        <DlGroup wrap gap='xs' justifyContent='space-between'>
          <Dt color='grey-50' size='xs'>
            <Trans>Gas Estimate</Trans>
          </Dt>
          <Dd size='xs'>
            <Flex alignItems='center' elementType='span' gap='s'>
              {false && <Spinner size='12' thickness={2} />}
              <AmountLabel amount={gasEstimate} />
            </Flex>
          </Dd>
        </DlGroup>
      )}
    </Dl>
  </Card>
);

export { BridgeTransactionDetails };
