enum PosthogEvents {
  FUSION_SIGN_UP = 'user_fusion_sign_up',
  FUSION_SIGN_IN = 'user_fusion_sign_in',

  CONNECT_EVM_WALLET = 'connect_evm_wallet',
  CONNECT_BTC_WALLET = 'connect_btc_wallet',

  EVM_BRIDGE_INITIATED = 'evm_bridge_initiated',
  EVM_BRIDGE_APPROVAL = 'evm_bridge_approval',
  EVM_BRIDGE_COMPLETED = 'evm_bridge_completed',
  EVM_BRIDGE_FAILED = 'evm_bridge_failed',

  BTC_BRIDGE_INITIATED = 'btc_bridge_initiated',
  BTC_BRIDGE_COMPLETED = 'btc_bridge_completed',
  BTC_BRIDGE_FAILED = 'btc_bridge_failed',

  STRATEGY_STARTED = 'strategy_started',
  STRATEGY_COMPLETED = 'strategy_completed',
  STRATEGY_FAILED = 'strategy_failed'
}

export { PosthogEvents };
