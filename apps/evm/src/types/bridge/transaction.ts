import { Bitcoin, CurrencyAmount, ERC20Token, EvmCurrencies } from '@gobob/currency';
import { Address, TransactionReceipt } from 'viem';
import { GatewayOrder } from '@gobob/bob-sdk';
import { Icon } from '@gobob/ui';

import { GatewaySteps } from './steps';

enum TransactionDirection {
  L1_TO_L2,
  L2_TO_L1
}

enum BridgeTransactionStatus {
  STATE_ROOT_NOT_PUBLISHED = 'waiting-to-prove',
  READY_TO_PROVE = 'ready-to-prove',
  IN_CHALLENGE_PERIOD = 'waiting-to-finalize',
  READY_FOR_RELAY = 'ready-to-finalize',
  RELAYED = 'finalized',
  UNCONFIRMED_L1_TO_L2_MESSAGE = 'unconfirmed-l1-to-l2-message',
  FAILED_L1_TO_L2_MESSAGE = 'failed-l1-to-l2-message'
}

type BridgeTransaction = {
  type: TransactionType.Bridge;
  from: Address;
  to: Address;
  l1Token: Address;
  l2Token: Address;
  amount: CurrencyAmount<EvmCurrencies>;
  logoUrl: string;
  icon?: typeof Icon;
  gasEstimate?: CurrencyAmount<EvmCurrencies>;
  data?: string;
  date: Date;
  blockNumber?: number;
  transactionHash: Address;
  l1Receipt?: TransactionReceipt;
  l2Receipt?: TransactionReceipt;
  statusEndDate?: Date;
  direction: TransactionDirection;
  status: BridgeTransactionStatus | null;
};

type InitBridgeTransaction = Omit<
  BridgeTransaction,
  'transactionHash' | 'blockNumber' | 'status' | 'data' | 'date' | 'l1Receipt' | 'l2Receipt' | 'statusEndDate'
>;

enum TransactionType {
  Bridge = 'bridge',
  Gateway = 'gateway'
}

enum GatewayTransactionType {
  BRIDGE = 'bridge',
  STRATEGY = 'strategy'
}

type GatewayTransaction = {
  status: GatewaySteps;
  date: Date;
  confirmations: number;
  totalConfirmations: number;
  btcTxId: string;
  amount?: CurrencyAmount<ERC20Token>;
  logoUrl?: string;
  icon?: typeof Icon;
  type: TransactionType.Gateway;
  subType: GatewayTransactionType;
  isPending: boolean;
  order: GatewayOrder;
};

type InitGatewayTransaction = {
  txId?: string;
  type: TransactionType.Gateway;
  btcAmount: CurrencyAmount<Bitcoin>;
  amount?: CurrencyAmount<ERC20Token>;
  assetName?: string;
  fee: CurrencyAmount<Bitcoin>;
};

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

type Transaction = BridgeTransaction | GatewayTransaction;

export {
  BridgeTransactionStatus,
  GatewayTransactionSpeed,
  GatewayTransactionType,
  TransactionDirection,
  TransactionType
};
export type {
  BridgeTransaction,
  GatewayTransaction,
  GatewayTransactionFee,
  GatewayTransactionSpeedData,
  InitBridgeTransaction,
  InitGatewayTransaction,
  Transaction
};
