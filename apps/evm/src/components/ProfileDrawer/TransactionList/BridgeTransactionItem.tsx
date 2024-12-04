import { Flex, FlexProps } from '@gobob/ui';
import { useState } from 'react';

import { TransactionDetails } from './TransactionDetails';

import { L1_CHAIN, L2_CHAIN } from '@/constants';
import { BridgeTransaction, TransactionDirection } from '@/types';
import { BridgeStatus } from '@/app/[lang]/(bridge)/components/BridgeStatus';

type Props = { data: BridgeTransaction; onProveSuccess?: () => void; onRelaySuccess?: () => void };

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type BridgeTransactionItemProps = Props & InheritAttrs;

const BridgeTransactionItem = ({
  data,
  onProveSuccess,
  onRelaySuccess,
  ...props
}: BridgeTransactionItemProps): JSX.Element => {
  const [isExpanded, setExpanded] = useState(false);

  const fromChaindId = data.direction === TransactionDirection.L1_TO_L2 ? L1_CHAIN : L2_CHAIN;
  const toChaindId = data.direction === TransactionDirection.L1_TO_L2 ? L2_CHAIN : L1_CHAIN;

  return (
    <Flex direction='column' {...props}>
      <TransactionDetails
        amount={data.amount}
        date={data.date}
        direction={data.direction}
        fromChainId={fromChaindId}
        isExpanded={isExpanded}
        toChainId={toChaindId}
        onExpand={() => setExpanded((isExpanded) => !isExpanded)}
      />
      <BridgeStatus
        data={data}
        isExpanded={isExpanded}
        onProveSuccess={onProveSuccess}
        onRelaySuccess={onRelaySuccess}
      />
    </Flex>
  );
};

export { BridgeTransactionItem };
