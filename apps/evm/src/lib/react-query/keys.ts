import { Address } from 'viem';

type TransactionType = 'deposit' | 'withdraw';

export const bridgeKeys = {
  transactions: (address: Address | undefined) => ['bridge-transactions', address],
  transaction: (address: Address | undefined, hash: Address, type: TransactionType) => [
    ...bridgeKeys.transactions(address),
    hash,
    type
  ],
  depositEthTransaction: (address: Address | undefined, hash: Address) => [
    ...bridgeKeys.transaction(address, hash, 'deposit'),
    'eth'
  ],
  depositErc20Transaction: (address: Address | undefined, hash: Address) => [
    ...bridgeKeys.transaction(address, hash, 'deposit'),
    'erc20'
  ],
  withdrawEthTransaction: (address: Address | undefined, hash: Address) => [
    ...bridgeKeys.transaction(address, hash, 'withdraw'),
    'eth'
  ],
  withdrawErc20Transaction: (address: Address | undefined, hash: Address) => [
    ...bridgeKeys.transaction(address, hash, 'withdraw'),
    'erc20'
  ],
  receiptTransaction: (address: Address | undefined, hash: Address, chain: 'l1' | 'l2') => [
    address,
    hash,
    chain,
    'receipt'
  ],
  withdrawStatusTransaction: (address: Address | undefined, hash: Address) => [
    ...bridgeKeys.transaction(address, hash, 'withdraw'),
    'status'
  ],
  withdrawStatusTimeTransaction: (address: Address | undefined, hash: Address, status: string) => [
    ...bridgeKeys.withdrawStatusTransaction(address, hash),
    status,
    'timeline'
  ],
  proveTransaction: (address: Address | undefined, hash: Address) => [address, hash, 'prove'],
  relayTransaction: (address: Address | undefined, hash: Address) => [address, hash, 'relay'],
  btc: (address: Address | undefined, btcAddress: string | undefined) => ['btc', address, btcAddress],
  btcQuote: (
    address: Address | undefined,
    btcAddress: string | undefined,
    isGasNeeded: boolean,
    btcTokenSymbol?: string,
    atomicAmount?: number | 'max'
  ) => [...bridgeKeys.btc(address, btcAddress), isGasNeeded, btcTokenSymbol, atomicAmount, 'quote'],
  btcDeposit: (address: Address | undefined, btcAddress: string | undefined) => [
    ...bridgeKeys.btc(address, btcAddress),
    'deposit'
  ],
  btcTokens: () => ['btc-tokens'],
  strategies: () => ['strategies']
};
