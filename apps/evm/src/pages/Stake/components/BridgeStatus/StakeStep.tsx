import { Address } from 'viem';

import { StakeSteps, StakeStepStatus } from '../../constants';
import { MessageDirection, MessageStatus } from '../../types';
import { chainL1, chainL2 } from '../../../../constants';
import { BridgeTransaction } from '../../hooks';

import { Pill } from './Pill';

const getLabel = (stage: StakeSteps, status: StakeStepStatus, isActing?: boolean, isActionSuccessful?: boolean) => {
  switch (stage) {
    case 'stake': {
      switch (status) {
        case 'idle':
          return 'Stake';
        case 'ongoing':
          return 'Staking...';
        default:
        case 'complete':
          return 'Staked';
      }
    }
    case 'l2-confirmation': {
      return 'L2 confirmation';
    }
    case 'unstake': {
      switch (status) {
        case 'idle':
          return 'Unstake';
        case 'ongoing':
          return 'Unstaking...';
        default:
        case 'complete':
          return 'Unstaked';
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

const unstakeOrder = {
  [MessageStatus.STATE_ROOT_NOT_PUBLISHED]: 1,
  [MessageStatus.READY_TO_PROVE]: 2,
  [MessageStatus.IN_CHALLENGE_PERIOD]: 3,
  [MessageStatus.READY_FOR_RELAY]: 4,
  [MessageStatus.RELAYED]: 5,
  [MessageStatus.FAILED_L1_TO_L2_MESSAGE]: -1,
  [MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE]: -1
} as const;

const getStakeStepStatus = (step: number, currentStep: number) => {
  if (currentStep < step) {
    return 'idle';
  } else if (currentStep === step) {
    return 'ongoing';
  } else {
    return 'complete';
  }
};

const getStatus = (step: StakeSteps, status: MessageStatus | null, direction: MessageDirection): StakeStepStatus => {
  if (!status) return 'idle';

  if (direction === MessageDirection.L1_TO_L2) {
    switch (step) {
      case 'stake': {
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

  const currentStep = unstakeOrder[status];

  switch (step) {
    case 'unstake': {
      return 'complete';
    }
    case 'state-root-published': {
      const step = unstakeOrder[MessageStatus.STATE_ROOT_NOT_PUBLISHED];

      return getStakeStepStatus(step, currentStep);
    }
    case 'prove': {
      const step = unstakeOrder[MessageStatus.READY_TO_PROVE];

      return getStakeStepStatus(step, currentStep);
    }
    case 'challenge-period': {
      const step = unstakeOrder[MessageStatus.IN_CHALLENGE_PERIOD];

      return getStakeStepStatus(step, currentStep);
    }
    case 'relay': {
      const step = unstakeOrder[MessageStatus.READY_FOR_RELAY];

      return getStakeStepStatus(step, currentStep);
    }
    case 'l1-confirmation': {
      const step = unstakeOrder[MessageStatus.RELAYED];

      return getStakeStepStatus(step, currentStep);
    }
  }

  return 'complete';
};

const getStepUrl = (step: StakeSteps, l1TransactionHash?: Address, l2TransactionHash?: Address) => {
  switch (step) {
    case 'stake':
    case 'l1-confirmation':
      return l1TransactionHash ? `${chainL1.blockExplorers?.default.url}/tx/${l1TransactionHash}` : undefined;
    case 'unstake':
    case 'l2-confirmation':
      return l2TransactionHash ? `${chainL2.blockExplorers?.default.url}/tx/${l2TransactionHash}` : undefined;
    default:
      return undefined;
  }
};

type StakeStepProps = {
  isActing?: boolean;
  isActionSuccessful?: boolean;
  step?: StakeSteps;
  data: BridgeTransaction;
};

const StakeStep = ({ data, isActing, isActionSuccessful, step }: StakeStepProps): JSX.Element => {
  const { status: messageStatus, l1Receipt, l2Receipt, direction } = data;

  if (step === undefined) {
    return <Pill label='Unknown' status='idle' />;
  }

  const href = getStepUrl(step, l1Receipt?.transactionHash, l2Receipt?.transactionHash);

  const status = getStatus(step, messageStatus, direction);

  const label = getLabel(step, status, isActing, isActionSuccessful);

  return <Pill href={href} label={label} status={status} />;
};

export { StakeStep };
