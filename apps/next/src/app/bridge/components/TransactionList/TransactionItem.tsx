import { Transaction } from '../../hooks';
import { TransactionType } from '../../types';

import { BridgeTransactionItem } from './BridgeTransactionItem';
import { OnRampTransactionItem } from './OnRampTransactionItem';

type TransactionItemProps = { data: Transaction };

const TransactionItem = ({ data }: TransactionItemProps): JSX.Element | null => {
  switch (data.type) {
    case TransactionType.Bridge:
      return <BridgeTransactionItem data={data} />;
    case TransactionType.OnRamp:
      return <OnRampTransactionItem data={data} />;
    default:
      return null;
  }
};

export { TransactionItem };
