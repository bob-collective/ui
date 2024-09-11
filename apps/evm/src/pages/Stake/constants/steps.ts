const stakeSteps = ['stake', 'l2-confirmation'] as const;

const unstakeSteps = [
  'unstake',
  'state-root-published',
  'prove',
  'challenge-period',
  'relay',
  'l1-confirmation'
] as const;

type StakeDepositSteps = (typeof stakeSteps)[number];

type StakeWithdrawSteps = (typeof unstakeSteps)[number];

type StakeSteps = StakeDepositSteps | StakeWithdrawSteps;

// l2-processing - relayer did not execute the swap
// l2-confirmation - relayer executed the swap
const gatewayDepositSteps = ['btc-confirmation', 'l2-processing', 'l2-confirmation'] as const;

type GatewayDepositSteps = (typeof gatewayDepositSteps)[number];

type GatewaySteps = (typeof gatewayDepositSteps)[number];

type StakeStepStatus = 'idle' | 'ongoing' | 'complete' | 'failed';

export type { StakeStepStatus, StakeSteps, GatewaySteps, GatewayDepositSteps };
