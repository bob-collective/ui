import { Flex, FlexProps } from '@gobob/ui';
import { useState } from 'react';

import { BridgeStatus } from '../BridgeStatus';
import { Type } from '../../bridge/Bridge';
import { BridgeTransaction } from '../../hooks';

import { TransactionDetails } from './TransactionDetails';

import { L1_CHAIN, L2_CHAIN } from '@/constants';
import { MessageDirection } from '@/types';

type Props = { data: BridgeTransaction };

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type BridgeTransactionItemProps = Props & InheritAttrs;

const BridgeTransactionItem = ({ data, ...props }: BridgeTransactionItemProps): JSX.Element => {
  const [isExpanded, setExpanded] = useState(false);

  const fromChaindId = data.direction === MessageDirection.L1_TO_L2 ? L1_CHAIN : L2_CHAIN;
  const toChaindId = data.direction === MessageDirection.L1_TO_L2 ? L2_CHAIN : L1_CHAIN;

  return (
    <Flex direction='column' {...props}>
      <TransactionDetails
        amount={data.amount}
        date={data.date}
        fromChainId={fromChaindId}
        isExpanded={isExpanded}
        toChainId={toChaindId}
        type={data.direction === MessageDirection.L1_TO_L2 ? Type.Deposit : Type.Withdraw}
        onExpand={() => setExpanded((isExpanded) => !isExpanded)}
      />
      <BridgeStatus data={data} isExpanded={isExpanded} />
    </Flex>
  );
};

export { BridgeTransactionItem };
