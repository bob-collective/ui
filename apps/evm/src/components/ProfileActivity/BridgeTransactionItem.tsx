import { Flex } from '@gobob/ui';

import { BridgeStatus } from '../BridgeStatus';

import { TransactionDetails } from './TransactionDetails';
import { TransactionItemCard } from './TransactionItemCard';

import { L1_CHAIN, L2_CHAIN } from '@/constants';
import { BridgeTransaction, TransactionDirection } from '@/types';

type BridgeTransactionItemProps = {
  data: BridgeTransaction;
  onProveSuccess?: () => void;
  onRelaySuccess?: () => void;
  isExpanded: boolean;
  onExpandChange: () => void;
};

const BridgeTransactionItem = ({
  data,
  onProveSuccess,
  onRelaySuccess,
  isExpanded,
  onExpandChange
}: BridgeTransactionItemProps): JSX.Element => {
  const fromChaindId = data.direction === TransactionDirection.L1_TO_L2 ? L1_CHAIN : L2_CHAIN;
  const toChaindId = data.direction === TransactionDirection.L1_TO_L2 ? L2_CHAIN : L1_CHAIN;

  return (
    <TransactionItemCard isExpanded={isExpanded} onExpandChange={onExpandChange}>
      <Flex direction='column' gap='s'>
        <TransactionDetails
          amount={data.amount}
          date={data.date}
          direction={data.direction}
          fromChainId={fromChaindId}
          icon={data.icon}
          isExpanded={isExpanded}
          toChainId={toChaindId}
        />
        <BridgeStatus
          data={data}
          isExpanded={isExpanded}
          onProveSuccess={onProveSuccess}
          onRelaySuccess={onRelaySuccess}
        />
      </Flex>
    </TransactionItemCard>
  );
};

export { BridgeTransactionItem };
