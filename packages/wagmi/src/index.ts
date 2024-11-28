export { watchAccount, watchContractEvent } from '@wagmi/core';
export type { WriteContractErrorType, WriteContractReturnType } from '@wagmi/core';
export * from 'wagmi';
export * from 'wagmi/query';
export * from './bob';
export * from './config';
export * from './hooks';
// @ts-ignore
export * from './sepolia';
// @ts-ignore
export * from './mainnet';

export type { Address } from 'viem';

export { WagmiProvider } from './provider';
export type { WagmiProviderProps } from './provider';
