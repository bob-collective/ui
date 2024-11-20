import type { Address, ContractFunctionArgs } from 'viem';

import { Config, useAccount, useWriteContract, WriteContractVariables } from '@gobob/wagmi';

import {
  UseWriteOPActionBaseParameters,
  UseWriteOPActionBaseReturnType,
  WriteDepositERC20ActionParameters,
  WriteOPContractBaseParameters
} from './types.js';

import { l1StandardBridgeAbi } from '@/abis/L1StandardBridge.abi';
import { L1_CHAIN } from '@/constants';

const ABI = l1StandardBridgeAbi;
const FUNCTION = 'depositERC20To';

type WriteDepositERC20Parameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = number
> = WriteOPContractBaseParameters<typeof ABI, typeof FUNCTION, config, chainId> & {
  // The L1CrossDomainMessenger will add the L2 gas we need, so we can pass 0 to the contract by default & make the argument optional
  args: Omit<Pick<WriteDepositERC20ActionParameters, 'args'>['args'], 'minGasLimit'> & { minGasLimit?: number };
} & {
  l1StandardBridge: Address;
};

type UseWriteDepositERC20Parameters<config extends Config = Config, context = unknown> = UseWriteOPActionBaseParameters<
  config,
  context
>;

type UseWriteDepositERC20ReturnType<config extends Config = Config, context = unknown> = Omit<
  UseWriteOPActionBaseReturnType<WriteDepositERC20Parameters, config, context>,
  'write' | 'writeAsync'
> & {
  writeDepositERC20: UseWriteOPActionBaseReturnType<WriteDepositERC20Parameters, config, context>['write'];
  writeDepositERC20Async: UseWriteOPActionBaseReturnType<WriteDepositERC20Parameters, config, context>['writeAsync'];
};

/**
 * Deposits ERC20 tokens to L2 using the standard bridge
 * @param parameters - {@link UseWriteDepositERC20Parameters}
 * @returns wagmi [useWriteContract return type](https://alpha.wagmi.sh/react/api/hooks/useWrtieContract#return-type). {@link UseWriteDepositERC20ReturnType}
 */
function useWriteDepositERC20<config extends Config = Config, context = unknown>(
  args: UseWriteDepositERC20Parameters<config, context> = {}
): UseWriteDepositERC20ReturnType<config, context> {
  const { writeContract, writeContractAsync, ...writeReturn } = useWriteContract(args);
  const account = useAccount(args);

  const writeDepositERC20: UseWriteDepositERC20ReturnType<config, context>['writeDepositERC20'] = (
    { l1StandardBridge, args, ...rest },
    options
  ) => {
    return writeContract(
      {
        chainId: L1_CHAIN,
        address: l1StandardBridge,
        abi: ABI,
        functionName: FUNCTION,
        args: [args.l1Token, args.l2Token, args.to, args.amount, args.minGasLimit ?? 0, args.extraData ?? '0x'],
        account: account.address,
        ...rest
      } as unknown as WriteContractVariables<
        typeof ABI,
        typeof FUNCTION,
        ContractFunctionArgs<typeof ABI, 'nonpayable', typeof FUNCTION>,
        config,
        config['chains'][number]['id']
      >,
      options
    );
  };

  const writeDepositERC20Async: UseWriteDepositERC20ReturnType<config, context>['writeDepositERC20Async'] = (
    { l1StandardBridge, args, ...rest },
    options
  ) => {
    return writeContractAsync(
      {
        chainId: L1_CHAIN,
        address: l1StandardBridge,
        abi: ABI,
        functionName: FUNCTION,
        args: [args.l1Token, args.l2Token, args.to, args.amount, args.minGasLimit ?? 0, args.extraData ?? '0x'],
        account: account.address,
        ...rest
      } as unknown as WriteContractVariables<
        typeof ABI,
        typeof FUNCTION,
        ContractFunctionArgs<typeof ABI, 'nonpayable', typeof FUNCTION>,
        config,
        config['chains'][number]['id']
      >,
      options
    );
  };

  return {
    writeDepositERC20,
    writeDepositERC20Async,
    ...writeReturn
  } as unknown as UseWriteDepositERC20ReturnType<config, context>;
}

export { useWriteDepositERC20 };
