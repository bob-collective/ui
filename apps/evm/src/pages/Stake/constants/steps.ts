// l2-processing - relayer did not execute the swap
// l2-confirmation - relayer executed the swap
const gatewayDepositSteps = ['btc-confirmation', 'l2-processing', 'l2-confirmation'] as const;

type GatewayDepositSteps = (typeof gatewayDepositSteps)[number];

export type { GatewayDepositSteps };
