import { Currency, CurrencyAmount } from '@gobob/currency';
import { CheckCircle, Flex, P } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { Chain } from 'viem';

import { ChainLogo } from '@/components';

type FinalStepProps = {
  fromChain: Chain;
  toChain: Chain;
  currencyAmount: CurrencyAmount<Currency>;
  isComplete: boolean;
};

const FinalStep = ({ fromChain, toChain, currencyAmount, isComplete }: FinalStepProps) => (
  <Flex alignItems='center' gap='s' justifyContent='space-between' style={{ height: '100%' }}>
    <Flex alignItems='center' gap='s'>
      <ChainLogo chainId={fromChain.id} size='xl' />
      <P weight='semibold'>
        <Trans>
          Get {currencyAmount.toSignificant(2)} {currencyAmount.currency.symbol} on {toChain.name}
        </Trans>
      </P>
    </Flex>
    {isComplete && <CheckCircle color='green-500' />}
  </Flex>
);

export { FinalStep };
