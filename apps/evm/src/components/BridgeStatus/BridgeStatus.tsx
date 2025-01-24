import { FlexProps } from '@gobob/ui';

import { DepositStatus } from './DepositStatus';
import { WithdrawStatus } from './WithdrawStatus';

import { BridgeTransaction, TransactionDirection } from '@/types';

type Props = { data: BridgeTransaction; isExpanded: boolean; onProveSuccess?: () => void; onRelaySuccess?: () => void };

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type BridgeStatusProps = Props & InheritAttrs;

const BridgeStatus = ({ data, isExpanded, onProveSuccess, onRelaySuccess }: BridgeStatusProps): JSX.Element => {
  if (data.direction === TransactionDirection.L1_TO_L2) {
    return <DepositStatus data={data} isExpanded={isExpanded} />;
  }

  return (
    <WithdrawStatus
      data={data}
      isExpanded={isExpanded}
      onProveSuccess={onProveSuccess}
      onRelaySuccess={onRelaySuccess}
    />
  );
};

export { BridgeStatus };
