import posthog from 'posthog-js';

const bridgeEvmEvents = {
  formTouched: (type: 'deposit' | 'withdraw', properties: { ticker: string }) =>
    posthog.capture(`bridge_evm_${type}_form_touched`, properties),
  approval: (type: 'deposit' | 'withdraw', properties: { amount: string; ticker: string }) =>
    posthog.capture(`bridge_evm_${type}_approval`, properties),
  initiated: (type: 'deposit' | 'withdraw', properties: { amount: string; ticker: string }) =>
    posthog.capture(`bridge_evm_${type}_initiated`, properties),
  completed: (type: 'deposit' | 'withdraw') => posthog.capture(`bridge_evm_${type}_completed`),
  failed: (type: 'deposit' | 'withdraw') => posthog.capture(`bridge_evm_${type}_failed`),
  external: (properties: { bridge: string }) => posthog.capture('evm_external_bridge', properties)
};

const bridgeBtcEvents = {
  formTouched: (type: 'deposit', properties: { ticker: string }) =>
    posthog.capture(`bridge_btc_${type}_form_touched`, properties),
  initiated: (type: 'deposit', properties: { amount: string; ticker: string }) =>
    posthog.capture(`bridge_btc_${type}_initiated`, properties),
  completed: (type: 'deposit') => posthog.capture(`bridge_btc_${type}_completed`),
  failed: (type: 'deposit') => posthog.capture(`bridge_btc_${type}_failed`)
};

const strategyEvents = {
  formTouched: (type: 'deposit', properties: { asset_name: string }) =>
    posthog.capture(`bridge_btc_${type}_form_touched`, properties),
  initiated: (type: 'deposit', properties: { amount: string; asset_name: string }) =>
    posthog.capture(`bridge_btc_${type}_initiated`, properties),
  completed: (type: 'deposit') => posthog.capture(`bridge_btc_${type}_completed`),
  failed: (type: 'deposit') => posthog.capture(`bridge_btc_${type}_failed`)
};

const posthogEvents = {
  fusion: {
    signUp: () => posthog.capture('user_fusion_sign_up', {}, { $set_once: { fusion_user: true } }),
    signIn: () => posthog.capture('user_fusion_sign_in', {}, { $set_once: { fusion_user: true } })
  },
  connect: {
    evm: (properties: { evm_address: string; wallet_name: string }) =>
      posthog.capture('connect_evm_wallet', properties, { $set: properties }),
    btc: (properties: { btc_address: string; wallet_name: string }) =>
      posthog.capture('connect_btc_wallet', properties, { $set: properties })
  },
  bridge: {
    evm: bridgeEvmEvents,
    btc: bridgeBtcEvents
  },
  strategy: strategyEvents,
  drawer: {
    buy: () => posthog.capture('drawer_buy')
  }
};

export { posthogEvents };
