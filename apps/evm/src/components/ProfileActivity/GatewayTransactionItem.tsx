import { Flex } from '@gobob/ui';

import { GatewayStatus } from '../GatewayStatus';

import { TransactionDetails } from './TransactionDetails';
import { TransactionItemCard } from './TransactionItemCard';

import { L2_CHAIN } from '@/constants';
import { GatewayTransaction, TransactionDirection } from '@/types';

type GatewayTransactionItemProps = { data: GatewayTransaction; isExpanded: boolean; onExpandChange: () => void };

const GatewayTransactionItem = ({ data, isExpanded, onExpandChange }: GatewayTransactionItemProps): JSX.Element => {
  const fromChaindId = 'BTC';
  const toChaindId = L2_CHAIN;

  return (
    <TransactionItemCard isExpanded={isExpanded} onExpandChange={onExpandChange}>
      <Flex direction='column' gap='s'>
        <TransactionDetails
          amount={data.amount}
          date={data.date}
          direction={TransactionDirection.L1_TO_L2}
          fromChainId={fromChaindId}
          icon={data.icon}
          isPending={data.isPending}
          toChainId={toChaindId}
        />
        <GatewayStatus data={data} isExpanded={isExpanded} />
      </Flex>
    </TransactionItemCard>
  );
};

export { GatewayTransactionItem };
