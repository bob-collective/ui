enum PosthogEvents {
  FUSION_SIGN_UP = 'user_fusion_sign_up',
  FUSION_SIGN_IN = 'user_fusion_sign_in',

  CONNECT_EVM_WALLET = 'connect_evm_wallet',
  CONNECT_BTC_WALLET = 'connect_btc_wallet',

  EVM_BRIDGE_FORM_TOUCHED = 'evm_bridge_form_touched',
  EVM_BRIDGE_APPROVAL = 'evm_bridge_approval',
  EVM_BRIDGE_INITIATED = 'evm_bridge_initiated',
  EVM_BRIDGE_COMPLETED = 'evm_bridge_completed',
  EVM_BRIDGE_FAILED = 'evm_bridge_failed',

  EVM_EXTERNAL_BRIDGE = 'evm_external_bridge',

  BTC_BRIDGE_FORM_TOUCHED = 'btc_bridge_form_touched',
  BTC_BRIDGE_INITIATED = 'btc_bridge_initiated',
  BTC_BRIDGE_COMPLETED = 'btc_bridge_completed',
  BTC_BRIDGE_FAILED = 'btc_bridge_failed',

  STRATEGY_DEPOSIT_FORM_TOUCHED = 'strategy_deposit_form_touched',
  STRATEGY_DEPOSIT_INITIATED = 'strategy_deposit_initiated',
  STRATEGY_DEPOSIT_COMPLETED = 'strategy_deposit_completed',
  STRATEGY_DEPOSIT_FAILED = 'strategy_deposit_failed',
  STRATEGY_WITHDRAW_EXTERNAL = 'strategy_withdraw_external',

  DRAWER_BUY = 'drawer_buy'
}

export { PosthogEvents };
