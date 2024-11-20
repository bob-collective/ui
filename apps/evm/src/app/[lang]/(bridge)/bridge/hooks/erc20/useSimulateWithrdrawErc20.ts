'use client';

import { Config, useAccount, useSimulateContract, type UseSimulateContractParameters } from '@gobob/wagmi';
import { Address } from 'viem';

import {
  SimulateWithdrawERC20ActionParameters,
  UseSimulateOPActionBaseParameters,
  UseSimulateOPActionBaseReturnType
} from './types';

import { l2StandardBridgeAbi } from '@/abis/L2StandardBridge.abi';
import { L2_CHAIN } from '@/constants';

const ABI = l2StandardBridgeAbi;
const FUNCTION = 'withdrawTo';

export type UseSimulateWithdrawERC20Parameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | undefined = undefined
> = UseSimulateOPActionBaseParameters<typeof ABI, typeof FUNCTION, config, chainId> & {
  // The CrossDomainMessenger will add the gas we need, so we can pass 0 to the contract by default & make the argument optional
  args: Omit<Pick<SimulateWithdrawERC20ActionParameters, 'args'>['args'], 'minGasLimit'> & { minGasLimit?: number };
} & {
  l2StandardBridge: Address;
};

export type UseSimulateWithdrawERC20ReturnType<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | undefined = undefined
> = UseSimulateOPActionBaseReturnType<typeof ABI, typeof FUNCTION, config, chainId>;

/**
 * Simulates a withdrawal of ERC20 tokens to an L1 address.
 * @param parameters - {@link UseSimulateWithdrawERC20Parameters}
 * @returns wagmi [useSimulateContract return type](https://alpha.wagmi.sh/react/api/hooks/useSimulateContract#return-type). {@link UseSimulateWithdrawERC20ReturnType}
 */
export function useSimulateWithdrawERC20<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | undefined = undefined
>({
  args,
  l2StandardBridge,
  query,
  ...rest
}: UseSimulateWithdrawERC20Parameters<config, chainId>): UseSimulateWithdrawERC20ReturnType<config, chainId> {
  const account = useAccount(rest);

  return useSimulateContract({
    address: l2StandardBridge,
    abi: ABI,
    chainId: L2_CHAIN,
    functionName: FUNCTION,
    args: [args.l2Token, args.to, args.amount, args.minGasLimit ?? 0, args.extraData ?? '0x'],
    query: query as UseSimulateContractParameters['query'],
    account: account.address,
    ...rest
  }) as unknown as UseSimulateWithdrawERC20ReturnType<config, chainId>;
}
