import { Address } from 'viem';

import { Pill } from './Pill';

import { BridgeSteps, BridgeStepStatus } from '@/constants';
import { MessageDirection, MessageStatus } from '@/types';
import { chainL1, chainL2 } from '@/constants';
import { BridgeTransaction } from '@/hooks';

const getLabel = (stage: BridgeSteps, status: BridgeStepStatus, isActing?: boolean, isActionSuccessful?: boolean) => {
  switch (stage) {
    case 'deposit': {
      switch (status) {
        case 'idle':
          return 'Deposit';
        case 'ongoing':
          return 'Depositing...';
        default:
        case 'complete':
          return 'Deposited';
      }
    }
    case 'l2-confirmation': {
      return 'L2 confirmation';
    }
    case 'withdraw': {
      switch (status) {
        case 'idle':
          return 'Withdraw';
        case 'ongoing':
          return 'Withdrawing...';
        default:
        case 'complete':
          return 'Withdrawn';
      }
    }
    case 'state-root-published': {
      switch (status) {
        case 'idle':
          return 'State root publishment';
        case 'ongoing':
          return 'Waiting for state root';
        default:
        case 'complete':
          return 'State root published';
      }
    }
    case 'prove': {
      switch (status) {
        case 'idle':
          return 'Prove';
        case 'ongoing':
          return isActionSuccessful ? 'Proved' : isActing ? 'Proving...' : 'Ready to prove...';
        default:
        case 'complete':
          return 'Proved';
      }
    }
    case 'challenge-period': {
      switch (status) {
        case 'idle':
          return 'Challenge period';
        case 'ongoing':
          return 'Challenge period';
        default:
        case 'complete':
          return 'Challenge period';
      }
    }
    case 'relay': {
      switch (status) {
        case 'idle':
          return 'Relay';
        case 'ongoing':
          return isActing ? 'Relaying...' : 'Ready to relay...';
        default:
        case 'complete':
          return 'Relayed';
      }
    }
    case 'l1-confirmation': {
      switch (status) {
        case 'idle':
          return 'Finalized';
        case 'ongoing':
          return 'Finalizing...';
        default:
        case 'complete':
          return 'Finalized';
      }
    }
  }
};

const withdrawOrder = {
  [MessageStatus.STATE_ROOT_NOT_PUBLISHED]: 1,
  [MessageStatus.READY_TO_PROVE]: 2,
  [MessageStatus.IN_CHALLENGE_PERIOD]: 3,
  [MessageStatus.READY_FOR_RELAY]: 4,
  [MessageStatus.RELAYED]: 5,
  [MessageStatus.FAILED_L1_TO_L2_MESSAGE]: -1,
  [MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE]: -1
} as const;

const getBridgeStepStatus = (step: number, currentStep: number) => {
  if (currentStep < step) {
    return 'idle';
  } else if (currentStep === step) {
    return 'ongoing';
  } else {
    return 'complete';
  }
};

const getStatus = (step: BridgeSteps, status: MessageStatus | null, direction: MessageDirection): BridgeStepStatus => {
  if (!status) return 'idle';

  if (direction === MessageDirection.L1_TO_L2) {
    switch (step) {
      case 'deposit': {
        return status === MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE ? 'ongoing' : 'complete';
      }
      case 'l2-confirmation': {
        switch (status) {
          case MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE:
            return 'idle';
          case MessageStatus.RELAYED:
            return 'complete';
          case MessageStatus.FAILED_L1_TO_L2_MESSAGE:
            return 'failed';

          default:
            return 'ongoing';
        }
      }
    }
  }

  const currentStep = withdrawOrder[status];

  switch (step) {
    case 'withdraw': {
      return 'complete';
    }
    case 'state-root-published': {
      const step = withdrawOrder[MessageStatus.STATE_ROOT_NOT_PUBLISHED];

      return getBridgeStepStatus(step, currentStep);
    }
    case 'prove': {
      const step = withdrawOrder[MessageStatus.READY_TO_PROVE];

      return getBridgeStepStatus(step, currentStep);
    }
    case 'challenge-period': {
      const step = withdrawOrder[MessageStatus.IN_CHALLENGE_PERIOD];

      return getBridgeStepStatus(step, currentStep);
    }
    case 'relay': {
      const step = withdrawOrder[MessageStatus.READY_FOR_RELAY];

      return getBridgeStepStatus(step, currentStep);
    }
    case 'l1-confirmation': {
      const step = withdrawOrder[MessageStatus.RELAYED];

      return getBridgeStepStatus(step, currentStep);
    }
  }

  return 'complete';
};

const getStepUrl = (step: BridgeSteps, l1TransactionHash?: Address, l2TransactionHash?: Address) => {
  switch (step) {
    case 'deposit':
    case 'l1-confirmation':
      return l1TransactionHash ? `${chainL1.blockExplorers?.default.url}/tx/${l1TransactionHash}` : undefined;
    case 'withdraw':
    case 'l2-confirmation':
      return l2TransactionHash ? `${chainL2.blockExplorers?.default.url}/tx/${l2TransactionHash}` : undefined;
    default:
      return undefined;
  }
};

type BridgeStepProps = {
  isActing?: boolean;
  isActionSuccessful?: boolean;
  step?: BridgeSteps;
  data: BridgeTransaction;
};

const BridgeStep = ({ data, isActing, isActionSuccessful, step }: BridgeStepProps): JSX.Element => {
  const { status: messageStatus, l1Receipt, l2Receipt, direction } = data;

  if (step === undefined) {
    return <Pill label='Unknown' status='idle' />;
  }

  const href = getStepUrl(step, l1Receipt?.transactionHash, l2Receipt?.transactionHash);

  const status = getStatus(step, messageStatus, direction);

  const label = getLabel(step, status, isActing, isActionSuccessful);

  return <Pill href={href} label={label} status={status} />;
};

export { BridgeStep };
