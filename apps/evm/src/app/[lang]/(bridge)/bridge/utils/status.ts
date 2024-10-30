import { BridgeSteps, BridgeTransactionStatus, TransactionDirection } from '@/types';

const getOngoingBridgeStep = (status: BridgeTransactionStatus, direction: TransactionDirection): BridgeSteps => {
  switch (status) {
    case BridgeTransactionStatus.UNCONFIRMED_L1_TO_L2_MESSAGE:
      return 'deposit';
    default:
    case BridgeTransactionStatus.READY_FOR_RELAY:
      return 'relay';
    case BridgeTransactionStatus.RELAYED:
      return direction === TransactionDirection.L1_TO_L2 ? 'l2-confirmation' : 'l1-confirmation';
    case BridgeTransactionStatus.READY_TO_PROVE:
      return 'prove';
    case BridgeTransactionStatus.STATE_ROOT_NOT_PUBLISHED:
      return 'state-root-published';
    case BridgeTransactionStatus.IN_CHALLENGE_PERIOD:
      return 'challenge-period';
  }
};

export { getOngoingBridgeStep };
