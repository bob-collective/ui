import type { MutateOptions } from '@gobob/react-query';
import type {
  Config,
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
  Hex,
  SendTransactionParameters
} from 'viem';

export type DepositERC20Parameters = {
  l1Token: Address;
  l2Token: Address;
  to: Address;
  amount: bigint;
  minGasLimit: number;
  extraData?: Hex;
};

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
