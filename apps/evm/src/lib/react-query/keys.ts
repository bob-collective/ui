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
  strategies: (address?: Address | undefined) => ['strategies', address] as string[],
  approval: (address: Address | undefined) => ['bridge-approval', address],
  deposit: (address: Address | undefined) => ['bridge-deposit', address],
  gasEstimate: (
    direction: number,
    address: Address | undefined,
    assetAddressL1?: Address,
    assetAddressL2?: Address
  ) => ['bridge-gas-estimate', direction, address, assetAddressL1, assetAddressL2],
  withdraw: (address: Address | undefined) => ['bridge-withdraw', address]
};

export const appsKeys = {
  apps: () => ['apps'],
  appsVotes: (username: string | undefined) => [...appsKeys.apps(), 'votes', username],
  appsResultVotes: () => [...appsKeys.apps(), 'result-votes'],
  vote: (username: string | undefined) => [appsKeys.apps(), 'vote', username] as string[]
};

export const fusionKeys = {
  fusion: () => ['fusion'],
  user: () => [...fusionKeys.fusion(), 'user'],
  login: () => [...fusionKeys.fusion(), 'login'],
  signUp: () => [...fusionKeys.fusion(), 'sign-up'],
  referralCode: () => [...fusionKeys.fusion(), 'referral-code'],
  leaderboard: () => [...fusionKeys.fusion(), 'leaderboard'],
  leaderboardOverview: () => [...fusionKeys.fusion(), 'leaderboard-overview'],
  tokenInfo: () => [...fusionKeys.fusion(), 'token-info'],
  totalHarvesters: () => [...fusionKeys.fusion(), 'total-harvesters'],
  quests: () => [...fusionKeys.fusion(), 'quests'],
  tvlLevel: () => [...fusionKeys.fusion(), 'tvl-level'],
  lotteryStats: (username: string | undefined) => [...fusionKeys.fusion(), 'lottery-stats', username] as string[],
  lotteryRoll: (username: string | undefined) => [...fusionKeys.fusion(), 'lottery-roll', username] as string[],
  lotteryTimeToNextDraw: () => [...fusionKeys.fusion(), 'lottery-time-to-next-draw'],
  topUserModal: (username: string | undefined) => [...fusionKeys.fusion(), 'top-user-modal', username] as string[],
  opSuperuserModal: (username: string | undefined) =>
    [...fusionKeys.fusion(), 'op-superuser-modal', username] as string[]
};
