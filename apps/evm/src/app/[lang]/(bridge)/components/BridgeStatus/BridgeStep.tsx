import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Address } from 'viem';

import { BridgeTransaction } from '../../hooks';
import { StatusChip } from '../StatusChip';

import { BridgeSteps, BridgeStepStatus, BridgeTransactionStatus, TransactionDirection } from '@/types';
import { chainL1, chainL2 } from '@/constants';

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
  [BridgeTransactionStatus.STATE_ROOT_NOT_PUBLISHED]: 1,
  [BridgeTransactionStatus.READY_TO_PROVE]: 2,
  [BridgeTransactionStatus.IN_CHALLENGE_PERIOD]: 3,
  [BridgeTransactionStatus.READY_FOR_RELAY]: 4,
  [BridgeTransactionStatus.RELAYED]: 5,
  [BridgeTransactionStatus.FAILED_L1_TO_L2_MESSAGE]: -1,
  [BridgeTransactionStatus.UNCONFIRMED_L1_TO_L2_MESSAGE]: -1
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

const getStatus = (
  step: BridgeSteps,
  status: BridgeTransactionStatus | null,
  direction: TransactionDirection
): BridgeStepStatus => {
  if (!status) return 'idle';

  if (direction === TransactionDirection.L1_TO_L2) {
    switch (step) {
      case 'deposit': {
        return status === BridgeTransactionStatus.UNCONFIRMED_L1_TO_L2_MESSAGE ? 'ongoing' : 'complete';
      }
      case 'l2-confirmation': {
        switch (status) {
          case BridgeTransactionStatus.UNCONFIRMED_L1_TO_L2_MESSAGE:
            return 'idle';
          case BridgeTransactionStatus.RELAYED:
            return 'complete';
          case BridgeTransactionStatus.FAILED_L1_TO_L2_MESSAGE:
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
      const step = withdrawOrder[BridgeTransactionStatus.STATE_ROOT_NOT_PUBLISHED];

      return getBridgeStepStatus(step, currentStep);
    }
    case 'prove': {
      const step = withdrawOrder[BridgeTransactionStatus.READY_TO_PROVE];

      return getBridgeStepStatus(step, currentStep);
    }
    case 'challenge-period': {
      const step = withdrawOrder[BridgeTransactionStatus.IN_CHALLENGE_PERIOD];

      return getBridgeStepStatus(step, currentStep);
    }
    case 'l1-confirmation':
    case 'relay': {
      const step = withdrawOrder[BridgeTransactionStatus.READY_FOR_RELAY];

      return getBridgeStepStatus(step, currentStep);
    }
  }

  return 'complete';
};

const getStepUrl = (
  step: BridgeSteps,
  transactionHash: Address,
  l1TransactionHash?: Address,
  l2TransactionHash?: Address
) => {
  switch (step) {
    case 'deposit': {
      return `${chainL1.blockExplorers?.default.url}/tx/${transactionHash}`;
    }
    case 'l1-confirmation': {
      return l1TransactionHash ? `${chainL1.blockExplorers?.default.url}/tx/${l1TransactionHash}` : undefined;
    }
    case 'withdraw': {
      return `${chainL2.blockExplorers?.default.url}/tx/${transactionHash}`;
    }
    case 'l2-confirmation': {
      return l2TransactionHash ? `${chainL2.blockExplorers?.default.url}/tx/${l2TransactionHash}` : undefined;
    }
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
  const { i18n } = useLingui();
  const { status: messageStatus, l1Receipt, l2Receipt, direction, transactionHash } = data;

  if (step === undefined) {
    return <StatusChip label={t(i18n)`Unknown`} status='idle' />;
  }

  const href = getStepUrl(step, transactionHash, l1Receipt?.transactionHash, l2Receipt?.transactionHash);

  const status = getStatus(step, messageStatus, direction);

  const label = getLabel(step, status, isActing, isActionSuccessful);

  return <StatusChip href={href} label={label} status={status} />;
};

export { BridgeStep, getOngoingBridgeStep };
