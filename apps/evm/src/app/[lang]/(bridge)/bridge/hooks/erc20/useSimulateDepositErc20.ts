'use client';

import { type Config, useAccount, useSimulateContract, type UseSimulateContractParameters } from '@gobob/wagmi';
import { Address } from 'viem';

import {
  SimulateDepositERC20Parameters,
  UseSimulateOPActionBaseParameters,
  UseSimulateOPActionBaseReturnType
} from './types';

import { l1StandardBridgeAbi } from '@/abis/L1StandardBridge.abi';
import { L1_CHAIN } from '@/constants';

const ABI = l1StandardBridgeAbi;
const FUNCTION = 'depositERC20To';

export type UseSimulateDepositERC20Parameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | undefined = undefined
> = UseSimulateOPActionBaseParameters<typeof ABI, typeof FUNCTION, config, chainId> & {
  // The L1CrossDomainMessenger will add the L2 gas we need, so we can pass 0 to the contract by default & make the argument optional
  args: Omit<Pick<SimulateDepositERC20Parameters, 'args'>['args'], 'minGasLimit'> & { minGasLimit?: number };
} & {
  l1StandardBridge: Address;
};

export type UseSimulateDepositERC20ReturnType<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | undefined = undefined
> = UseSimulateOPActionBaseReturnType<typeof ABI, typeof FUNCTION, config, chainId>;

/**
 * Simulates a deposit of ERC20 tokens to L2
 * @param parameters - {@link UseSimulateDepositERC20Parameters}
 * @returns wagmi [useSimulateContract return type](https://alpha.wagmi.sh/react/api/hooks/useSimulateContract#return-type). {@link UseSimulateDepositERC20ReturnType}
 */
export function useSimulateDepositERC20<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | undefined = undefined
>({
  args,
  l1StandardBridge,
  query,
  ...rest
}: UseSimulateDepositERC20Parameters<config, chainId>): UseSimulateDepositERC20ReturnType<config, chainId> {
  const account = useAccount(rest);

  return useSimulateContract({
    address: l1StandardBridge,
    abi: ABI,
    functionName: FUNCTION,
    args: [args.l1Token, args.l2Token, args.to, args.amount, args.minGasLimit ?? 0, args.extraData ?? '0x'],
    chainId: L1_CHAIN,
    query: query as UseSimulateContractParameters['query'],
    account: account.address,
    ...rest
  }) as unknown as UseSimulateDepositERC20ReturnType<config, chainId>;
}
