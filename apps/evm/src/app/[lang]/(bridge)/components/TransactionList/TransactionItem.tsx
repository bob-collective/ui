import { Transaction } from '../../hooks';

import { BridgeTransactionItem } from './BridgeTransactionItem';
import { GatewayTransactionItem } from './GatewayTransactionItem';

import { TransactionType } from '@/types';

type TransactionItemProps = { data: Transaction };

const TransactionItem = ({ data }: TransactionItemProps): JSX.Element | null => {
  switch (data.type) {
    case TransactionType.Bridge:
      return <BridgeTransactionItem data={data} />;
    case TransactionType.Gateway:
      return <GatewayTransactionItem data={data} />;
    default:
      return null;
  }
};

export { TransactionItem };