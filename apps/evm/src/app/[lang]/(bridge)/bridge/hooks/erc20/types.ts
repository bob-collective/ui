import type { MutateOptions } from '@gobob/react-query';
import type {
  Config,
  SimulateContractData,
  UseSimulateContractParameters,
  UseSimulateContractReturnType,
  UseWriteContractParameters,
  UseWriteContractReturnType,
  WriteContractData,
  WriteContractErrorType,
  WriteContractReturnType,
  WriteContractVariables
} from '@gobob/wagmi';
import type {
  Abi,
  Account,
  Address,
  Chain,
  ContractFunctionArgs,
  ContractFunctionName,
  DeriveChain,
  Hex,
  SendTransactionParameters,
  SimulateContractParameters,
  WriteContractParameters
} from 'viem';

import { l2StandardBridgeAbi } from '@/abis/L2StandardBridge.abi';
import { l1StandardBridgeAbi } from '@/abis/L1StandardBridge.abi';

export type UseWriteOPActionBaseParameters<
  config extends Config = Config,
  context = unknown
> = UseWriteContractParameters<config, context>;

export type UseWriteOPActionBaseReturnType<args, config extends Config = Config, context = unknown> = Omit<
  UseWriteContractReturnType<config, context>,
  'writeContract' | 'writeContractAsync'
> & {
  write: (
    args: args,
    options?:
      | MutateOptions<
          WriteContractData,
          WriteContractErrorType,
          WriteContractVariables<Abi, string, readonly unknown[], config, config['chains'][number]['id']>,
          context
        >
      | undefined
  ) => void;
  writeAsync: (
    args: args,
    options?:
      | MutateOptions<
          WriteContractData,
          WriteContractErrorType,
          WriteContractVariables<Abi, string, readonly unknown[], config, config['chains'][number]['id']>,
          context
        >
      | undefined
  ) => Promise<WriteContractReturnType>;
};

export type WriteOPContractBaseParameters<
  abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, 'nonpayable' | 'payable'>,
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = number,
  allFunctionNames = ContractFunctionName<abi, 'nonpayable' | 'payable'>
> = Omit<
  WriteContractVariables<
    abi,
    functionName,
    ContractFunctionArgs<abi, 'nonpayable' | 'payable', functionName>,
    config,
    chainId,
    allFunctionNames
  >,
  'abi' | 'functionName' | 'args' | 'chainId' | 'address' | 'type' | 'gasPrice' | 'account' | 'value'
>;

export type ContractAddress<chainId = number> = { address: Address; chainId: chainId; blockCreated?: number };

export type RawOrContractAddress<chainId> = Address | ContractAddress<chainId>;

export type L1WriteActionBaseType<
  TChain extends Chain | undefined = Chain,
  TAccount extends Account | undefined = Account | undefined,
  TChainOverride extends Chain | undefined = Chain | undefined
> = Omit<SendTransactionParameters<TChain, TAccount, TChainOverride>, 'chain'>;

export type DepositERC20Parameters = {
  l1Token: Address;
  l2Token: Address;
  to: Address;
  amount: bigint;
  minGasLimit: number;
  extraData?: Hex;
};

export type WriteDepositERC20ActionParameters<
  TChain extends Chain | undefined = Chain,
  TAccount extends Account | undefined = Account | undefined,
  TChainOverride extends Chain | undefined = Chain | undefined,
  _chainId = TChain extends Chain ? TChain['id'] : number
> = { args: DepositERC20Parameters; l1StandardBridge: RawOrContractAddress<_chainId> } & L1WriteActionBaseType<
  TChain,
  TAccount,
  TChainOverride
>;

/// WITHDRAW

export type WithdrawToParameters = {
  l2Token: Address;
  to: Address;
  amount: bigint;
  minGasLimit: number;
  extraData?: Hex;
};

export type L2WriteContractParameters<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<abi, 'nonpayable' | 'payable'> = ContractFunctionName<
    abi,
    'nonpayable' | 'payable'
  >,
  args extends ContractFunctionArgs<abi, 'nonpayable' | 'payable', functionName> = ContractFunctionArgs<
    abi,
    'nonpayable' | 'payable',
    functionName
  >,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined
> = Omit<
  WriteContractParameters<abi, functionName, args, chain, account, chainOverride>,
  'abi' | 'functionName' | 'args' | 'address'
>;

// Type for ERC20 withdrawal parameters
export type WriteWithdrawERC20ActionParameters<
  chain extends Chain | undefined = Chain,
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined
> = {
  args: WithdrawToParameters; // Ensure WithdrawToParameters is correctly typed
} & L2WriteContractParameters<
  typeof l2StandardBridgeAbi,
  'withdrawTo',
  ContractFunctionArgs<typeof l2StandardBridgeAbi, 'nonpayable', 'withdrawTo'>,
  chain,
  account,
  chainOverride
>;

export type UseSimulateOPActionBaseParameters<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<abi, 'nonpayable' | 'payable'> = ContractFunctionName<
    abi,
    'nonpayable' | 'payable'
  >,
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  selectData = SimulateContractData<
    abi,
    functionName,
    ContractFunctionArgs<abi, 'payable' | 'nonpayable', functionName>,
    config,
    chainId
  >
> = Omit<
  UseSimulateContractParameters<
    abi,
    functionName,
    ContractFunctionArgs<abi, 'payable' | 'nonpayable', functionName>,
    config,
    chainId,
    selectData
  >,
  'value' | 'type' | 'gasPrice' | 'blockNumber' | 'address' | 'abi' | 'functionName' | 'args' | 'chainId' | 'config'
> & {
  config?: Config;
};

export type L2SimulateContractParameters<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<abi, 'nonpayable' | 'payable'> = ContractFunctionName<
    abi,
    'nonpayable' | 'payable'
  >,
  args extends ContractFunctionArgs<abi, 'nonpayable' | 'payable', functionName> = ContractFunctionArgs<
    abi,
    'nonpayable' | 'payable',
    functionName
  >,
  chain extends Chain | undefined = Chain | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  accountOverride extends Account | Address | undefined = undefined,
  ///
  derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>
> = Omit<
  SimulateContractParameters<abi, functionName, args, chain, chainOverride, accountOverride, derivedChain>,
  'abi' | 'functionName' | 'args' | 'address'
>;

export type UseSimulateOPActionBaseReturnType<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<abi, 'nonpayable' | 'payable'> = ContractFunctionName<
    abi,
    'nonpayable' | 'payable'
  >,
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  selectData = SimulateContractData<
    abi,
    functionName,
    ContractFunctionArgs<abi, 'payable' | 'nonpayable', functionName>,
    config,
    chainId
  >
> = UseSimulateContractReturnType<
  abi,
  functionName,
  ContractFunctionArgs<abi, 'payable' | 'nonpayable', functionName>,
  config,
  chainId,
  selectData
>;

export type SimulateWithdrawERC20ActionParameters<
  chain extends Chain | undefined = Chain | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  accountOverride extends Account | Address | undefined = undefined,
  ///
  derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>
> = {
  args: WithdrawToParameters; // Ensure WithdrawToParameters is correctly typed
} & L2SimulateContractParameters<
  typeof l2StandardBridgeAbi,
  'withdrawTo',
  ContractFunctionArgs<typeof l2StandardBridgeAbi, 'nonpayable', 'withdrawTo'>,
  chain,
  chainOverride,
  accountOverride,
  derivedChain
>;

// export type L1SimulateActionBaseType<
//   TChain extends Chain | undefined = Chain,
//   TChainOverride extends Chain | undefined = Chain | undefined,
//   TAbi extends Abi | readonly unknown[] = Abi,
//   TFunctioName extends string = string
// > = Omit<
//   SimulateContractParameters<TAbi, TFunctioName, TChain, TChainOverride>,
//   'abi' | 'functionName' | 'args' | 'address'
// >;

export type SimulateDepositERC20Parameters<
  chain extends Chain | undefined = Chain | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  accountOverride extends Account | Address | undefined = undefined,
  ///
  derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>
> = {
  args: DepositERC20Parameters; // Ensure WithdrawToParameters is correctly typed
} & L2SimulateContractParameters<
  typeof l1StandardBridgeAbi,
  'depositERC20To',
  ContractFunctionArgs<typeof l1StandardBridgeAbi, 'nonpayable', 'withdrawTo'>,
  chain,
  chainOverride,
  accountOverride,
  derivedChain
>;
