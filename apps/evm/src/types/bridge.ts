import { Bitcoin, CurrencyAmount, EvmCurrencies, Token } from '@gobob/currency';
import { Address, TransactionReceipt } from 'viem';

import { GatewayDepositSteps } from '../constants';

type BridgeTransaction = {
  type: TransactionType.Bridge;
  from: Address;
  to: Address;
  l1Token: Address;
  l2Token: Address;
  amount: CurrencyAmount<EvmCurrencies>;
  gasEstimate?: CurrencyAmount<EvmCurrencies>;
  data?: string;
  date: Date;
  blockNumber?: number;
  transactionHash: Address;
  l1Receipt?: TransactionReceipt;
  l2Receipt?: TransactionReceipt;
  statusEndDate?: Date;
  direction: MessageDirection;
  status: MessageStatus | null;
};

type InitBridgeTransaction = Omit<
  BridgeTransaction,
  'transactionHash' | 'blockNumber' | 'status' | 'data' | 'date' | 'l1Receipt' | 'l2Receipt' | 'statusEndDate'
>;

type GatewayTransaction = {
  type: TransactionType.Gateway;
  status: GatewayDepositSteps;
  date: Date;
  confirmations: number;
  totalConfirmations: number;
  btcTxId: string;
  amount: CurrencyAmount<Token>;
  fee?: CurrencyAmount<Bitcoin>;
  isPending: boolean;
};

type InitGatewayTransaction = Pick<GatewayTransaction, 'type' | 'amount' | 'fee'>;

enum TransactionType {
  Bridge,
  Gateway
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

export { TransactionType, MessageStatus, MessageDirection };
export type { GatewayTransaction, InitGatewayTransaction, BridgeTransaction, InitBridgeTransaction };
