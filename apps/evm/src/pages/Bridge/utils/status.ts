import { BridgeSteps } from '../constants';
import { MessageStatus, MessageDirection } from '../types';

const getOngoingBridgeStep = (status: MessageStatus, direction: MessageDirection): BridgeSteps => {
  switch (status) {
    case MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE:
      return 'deposit';
    default:
    case MessageStatus.READY_FOR_RELAY:
      return 'relay';
    case MessageStatus.RELAYED:
      return direction === MessageDirection.L1_TO_L2 ? 'l2-confirmation' : 'l1-confirmation';
    case MessageStatus.READY_TO_PROVE:
      return 'prove';
    case MessageStatus.STATE_ROOT_NOT_PUBLISHED:
      return 'state-root-published';
    case MessageStatus.IN_CHALLENGE_PERIOD:
      return 'challenge-period';
  }
};

export { getOngoingBridgeStep };
