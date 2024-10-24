import { Bitcoin, Currency, CurrencyAmount, ERC20Token, Ether } from '@gobob/currency';
import { Address } from 'viem';

type L2BridgeData = {
  amount: CurrencyAmount<ERC20Token | Ether>;
  gasEstimate: CurrencyAmount<ERC20Token | Ether>;
  direction: MessageDirection;
  transactionHash?: Address;
};

type GatewayData = {
  txid?: string;
  amount: CurrencyAmount<Currency> | CurrencyAmount<Currency>[];
  fee: CurrencyAmount<Bitcoin>;
};

enum TransactionType {
  Bridge = 'bridge',
  Gateway = 'gateway'
}

enum GatewayTransactionType {
  BRIDGE = 'bridge',
  STAKE = 'stake'
}

enum MessageDirection {
  L1_TO_L2,
  L2_TO_L1
}

enum MessageStatus {
  STATE_ROOT_NOT_PUBLISHED = 'waiting-to-prove',
  READY_TO_PROVE = 'ready-to-prove',
  IN_CHALLENGE_PERIOD = 'waiting-to-finalize',
  READY_FOR_RELAY = 'ready-to-finalize',
  RELAYED = 'finalized',
  UNCONFIRMED_L1_TO_L2_MESSAGE = 'unconfirmed-l1-to-l2-message',
  FAILED_L1_TO_L2_MESSAGE = 'failed-l1-to-l2-message'
}

enum GatewayTransactionSpeed {
  FASTEST = 'fastest',
  FAST = 'fast',
  SLOW = 'slow',
  MINIMUM = 'minimum',
  CUSTOM = 'custom'
}

type GatewayTransactionSpeedData = Record<Exclude<GatewayTransactionSpeed, GatewayTransactionSpeed.CUSTOM>, number>;

type GatewayTransactionFee =
  | { speed: Exclude<GatewayTransactionSpeed, GatewayTransactionSpeed.MINIMUM | GatewayTransactionSpeed.CUSTOM> }
  | { speed: GatewayTransactionSpeed.CUSTOM; networkRate: number };

export { TransactionType, MessageStatus, MessageDirection, GatewayTransactionSpeed, GatewayTransactionType };
export type { L2BridgeData, GatewayData, GatewayTransactionFee, GatewayTransactionSpeedData };
