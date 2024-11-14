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
    toToken?: string,
    toChain?: string | number,
    strategyAddress?: string,
    atomicAmount?: number | string | 'liquidity-check',
    gasRefill?: boolean
  ) => [
    ...bridgeKeys.btc(undefined, undefined),
    toToken,
    toChain,
    strategyAddress,
    atomicAmount,
    'quote',
    gasRefill ? 'gas-refill' : 'no-gas-refill'
  ],
  btcDeposit: (address: Address | undefined, btcAddress: string | undefined) => [
    ...bridgeKeys.btc(address, btcAddress),
    'deposit'
  ],
  btcTokens: () => ['btc-tokens'],
  strategies: () => ['strategies']
};

export const signUpKeys = {
  signUp: () => ['sign-up'],
  referralCode: () => ['referral-code']
};

export const appsKeys = {
  apps: () => ['apps'],
  appsVotes: (username: string | undefined) => [...appsKeys.apps(), 'votes', username],
  appsResultVotes: () => [...appsKeys.apps(), 'result-votes'],
  vote: (username: string | undefined) => [appsKeys.apps(), 'vote', username]
};

export const fusionKeys = {
  fusion: () => ['fusion'],
  leaderboard: () => [...fusionKeys.fusion(), 'leaderboard'],
  leaderboardOverview: () => [...fusionKeys.fusion(), 'leaderboard-overview'],
  tokenInfo: () => [...fusionKeys.fusion(), 'token-info'],
  quests: () => [...fusionKeys.fusion(), 'quests'],
  tvlLevel: () => [...fusionKeys.fusion(), 'tvl-level'],
  lotteryStats: (username: string | undefined) => [...fusionKeys.fusion(), 'lottery-stats', username],
  lotteryRoll: (username: string | undefined) => [...fusionKeys.fusion(), 'lottery-roll', username],
  topUserModal: (username: string | undefined) => [...fusionKeys.fusion(), 'top-user-modal', username]
};
