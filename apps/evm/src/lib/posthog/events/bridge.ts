import posthog from 'posthog-js';

type BridgeType = 'deposit' | 'withdraw';

type BridgeProperties = { amount: string; ticker: string };

const bridgeEvents = {
  evm: {
    interacted: (type: BridgeType, properties: Pick<BridgeProperties, 'ticker'>) =>
      posthog.capture(`bridge_evm_${type}_interacted`, properties),
    approval: (type: BridgeType, properties: BridgeProperties) =>
      posthog.capture(`bridge_evm_${type}_approval`, properties),
    initiated: (type: BridgeType, properties: BridgeProperties) =>
      posthog.capture(`bridge_evm_${type}_initiated`, properties),
    completed: (type: BridgeType) => posthog.capture(`bridge_evm_${type}_completed`),
    failed: (type: BridgeType) => posthog.capture(`bridge_evm_${type}_failed`),
    external: (properties: { bridge: string }) => posthog.capture('evm_external_bridge', properties)
  },
  btc: {
    interacted: (type: 'deposit', properties: Pick<BridgeProperties, 'ticker'>) =>
      posthog.capture(`bridge_btc_${type}_interacted`, properties),
    initiated: (type: 'deposit', properties: BridgeProperties) =>
      posthog.capture(`bridge_btc_${type}_initiated`, properties),
    completed: (type: 'deposit') => posthog.capture(`bridge_btc_${type}_completed`),
    failed: (type: 'deposit') => posthog.capture(`bridge_btc_${type}_failed`)
  }
};

export { bridgeEvents };
