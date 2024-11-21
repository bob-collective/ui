type BridgeDepositSteps = 'deposit' | 'l2-confirmation';

type BridgeWithdrawSteps =
  | 'withdraw'
  | 'state-root-published'
  | 'prove'
  | 'challenge-period'
  | 'relay'
  | 'l1-confirmation';

type BridgeSteps = BridgeDepositSteps | BridgeWithdrawSteps;

// l2-processing - relayer did not yet execute the swap
// l2-incomplete - relayer executed the swap but user did not get staking token
// l2-confirmation - relayer executed the swap
type GatewaySteps = 'btc-confirmation' | 'l2-processing' | 'l2-incomplete' | 'l2-confirmation';

type BridgeStepStatus = 'idle' | 'ongoing' | 'complete' | 'failed';

export type { BridgeStepStatus, BridgeSteps, GatewaySteps };
