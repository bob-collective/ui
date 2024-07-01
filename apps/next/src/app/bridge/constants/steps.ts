const bridgeDepositSteps = ['deposit', 'l2-confirmation'] as const;

const bridgeWithdrawSteps = [
  'withdraw',
  'state-root-published',
  'prove',
  'challenge-period',
  'relay',
  'l1-confirmation'
] as const;

type BridgeDepositSteps = (typeof bridgeDepositSteps)[number];

type BridgeWithdrawSteps = (typeof bridgeWithdrawSteps)[number];

type BridgeSteps = BridgeDepositSteps | BridgeWithdrawSteps;

// l2-processing - relayer did not execute the swap
// l2-confirmation - relayer executed the swap
const onRampDepositSteps = ['btc-confirmation', 'l2-processing', 'l2-confirmation'] as const;

type OnRampDepositSteps = (typeof onRampDepositSteps)[number];

type OnRampSteps = (typeof onRampDepositSteps)[number];

type BridgeStepStatus = 'idle' | 'ongoing' | 'complete' | 'failed';

export type { BridgeStepStatus, BridgeSteps, OnRampSteps, OnRampDepositSteps };
