import { useState } from 'react';

import { BridgeTransactionItem } from './BridgeTransactionItem';
import { GatewayTransactionItem } from './GatewayTransactionItem';

import { Transaction, TransactionType } from '@/types';

type TransactionItemProps = { data: Transaction; onProveSuccess?: () => void; onRelaySuccess?: () => void };

const TransactionItem = ({ data, onProveSuccess, onRelaySuccess }: TransactionItemProps): JSX.Element | null => {
  const [isExpanded, setExpanded] = useState(false);

  const handleExpandChange = () => setExpanded((s) => !s);

  switch (data.type) {
    case TransactionType.Bridge:
      return (
        <BridgeTransactionItem
          data={data}
          isExpanded={isExpanded}
          onExpandChange={handleExpandChange}
          onProveSuccess={onProveSuccess}
          onRelaySuccess={onRelaySuccess}
        />
      );
    case TransactionType.Gateway:
      return <GatewayTransactionItem data={data} isExpanded={isExpanded} onExpandChange={handleExpandChange} />;
    default:
      return null;
  }
};

export { TransactionItem };
