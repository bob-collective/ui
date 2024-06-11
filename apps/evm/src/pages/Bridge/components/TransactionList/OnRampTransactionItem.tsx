import { Flex, FlexProps } from '@gobob/ui';
import { useState } from 'react';

import { L2_CHAIN } from '../../../../constants';
import { OnRampTransaction } from '../../hooks/useGetTransactions';
import { OnRampStatus } from '../BridgeStatus';

import { TransactionDetails } from './TransactionDetails';

type Props = { data: OnRampTransaction };

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type OnRampTransactionItemProps = Props & InheritAttrs;

const OnRampTransactionItem = ({ data, ...props }: OnRampTransactionItemProps): JSX.Element => {
  const [isExpanded, setExpanded] = useState(false);

  const fromChaindId = 'BTC';
  const toChaindId = L2_CHAIN;

  return (
    <Flex direction='column' gap='md' {...props}>
      <TransactionDetails
        amount={data.amount}
        date={data.date}
        fromChainId={fromChaindId}
        toChainId={toChaindId}
        type='deposit'
        onExpand={() => setExpanded((isExpanded) => !isExpanded)}
      />
      <OnRampStatus data={data} isExpanded={isExpanded} />
    </Flex>
  );
};

export { OnRampTransactionItem };
