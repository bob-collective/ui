import { BridgeTransactionItem } from './BridgeTransactionItem';
import { GatewayTransactionItem } from './GatewayTransactionItem';

import { Transaction, TransactionType } from '@/types';

type TransactionItemProps = { data: Transaction; onProveSuccess?: () => void; onRelaySuccess?: () => void };

const TransactionItem = ({ data, onProveSuccess, onRelaySuccess }: TransactionItemProps): JSX.Element | null => {
  switch (data.type) {
    case TransactionType.Bridge:
      return <BridgeTransactionItem data={data} onProveSuccess={onProveSuccess} onRelaySuccess={onRelaySuccess} />;
    case TransactionType.Gateway:
      return <GatewayTransactionItem data={data} />;
    default:
      return null;
  }
};

export { TransactionItem };
