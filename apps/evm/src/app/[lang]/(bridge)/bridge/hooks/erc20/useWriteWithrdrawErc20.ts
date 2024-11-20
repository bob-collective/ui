'use client';

import type { Address, ContractFunctionArgs } from 'viem';

import { Config, useWriteContract, WriteContractVariables } from '@gobob/wagmi';

import {
  UseWriteOPActionBaseParameters,
  UseWriteOPActionBaseReturnType,
  WriteOPContractBaseParameters,
  WriteWithdrawERC20ActionParameters
} from './types';

import { l2StandardBridgeAbi } from '@/abis/L2StandardBridge.abi';
import { L2_CHAIN } from '@/constants/chain';

const ABI = l2StandardBridgeAbi;
const FUNCTION = 'withdrawTo';

export type WriteWithdrawERC20Parameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = number
> = WriteOPContractBaseParameters<typeof ABI, typeof FUNCTION, config, chainId> & {
  // The CrossDomainMessenger will add the gas we need, so we can pass 0 to the contract by default & make the argument optional
  args: Omit<Pick<WriteWithdrawERC20ActionParameters, 'args'>['args'], 'minGasLimit'> & { minGasLimit?: number };
} & {
  l2StandardBridge: Address;
};

export type UseWriteWithdrawERC20Parameters<
  config extends Config = Config,
  context = unknown
> = UseWriteOPActionBaseParameters<config, context>;

export type UseWriteWithdrawERC20ReturnType<config extends Config = Config, context = unknown> = Omit<
  UseWriteOPActionBaseReturnType<WriteWithdrawERC20Parameters, config, context>,
  'write' | 'writeAsync'
> & {
  writeWithdrawERC20: UseWriteOPActionBaseReturnType<WriteWithdrawERC20Parameters, config, context>['write'];
  writeWithdrawERC20Async: UseWriteOPActionBaseReturnType<WriteWithdrawERC20Parameters, config, context>['writeAsync'];
};

/**
 * Withdraws ERC20 tokens to an L1 address.
 * @param parameters - {@link UseWriteWithdrawERC20Parameters}
 * @returns wagmi [useWriteContract return type](https://alpha.wagmi.sh/react/api/hooks/useWrtieContract#return-type). {@link UseWriteWithdrawERC20ReturnType}
 */
export function useWriteWithdrawERC20<config extends Config = Config, context = unknown>(
  args: UseWriteWithdrawERC20Parameters<config, context> = {}
): UseWriteWithdrawERC20ReturnType<config, context> {
  const { writeContract, writeContractAsync, ...writeReturn } = useWriteContract(args);

  const writeWithdrawERC20: UseWriteWithdrawERC20ReturnType<config, context>['writeWithdrawERC20'] = (
    { l2StandardBridge, args, ...rest },
    options
  ) => {
    return writeContract(
      {
        chainId: L2_CHAIN,
        address: l2StandardBridge,
        abi: ABI,
        functionName: FUNCTION,
        args: [args.l2Token, args.to, args.amount, args.minGasLimit ?? 0, args.extraData || '0x'],
        ...rest
      } as unknown as WriteContractVariables<
        typeof ABI,
        typeof FUNCTION,
        ContractFunctionArgs<typeof ABI, 'payable', typeof FUNCTION>,
        config,
        config['chains'][number]['id']
      >,
      options
    );
  };

  const writeWithdrawERC20Async: UseWriteWithdrawERC20ReturnType<config, context>['writeWithdrawERC20Async'] = (
    { l2StandardBridge, args, ...rest },
    options
  ) => {
    return writeContractAsync(
      {
        chainId: L2_CHAIN,
        address: l2StandardBridge,
        abi: ABI,
        functionName: FUNCTION,
        args: [args.l2Token, args.to, args.amount, args.minGasLimit ?? 0, args.extraData || '0x'],
        ...rest
      } as unknown as WriteContractVariables<
        typeof ABI,
        typeof FUNCTION,
        ContractFunctionArgs<typeof ABI, 'payable', typeof FUNCTION>,
        config,
        config['chains'][number]['id']
      >,
      options
    );
  };

  return {
    writeWithdrawERC20,
    writeWithdrawERC20Async,
    ...writeReturn
  } as unknown as UseWriteWithdrawERC20ReturnType<config, context>;
}
