/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChainId } from '@gobob/chains';
import { Currency, CurrencyAmount } from '@gobob/currency';
import { INTERVAL, useQueries, useQuery } from '@gobob/react-query';
import { Address, useAccount } from '@gobob/wagmi';
import request, { gql } from 'graphql-request';
import { useCallback } from 'react';
import { TransactionReceipt, isAddressEqual } from 'viem';
import { GetWithdrawalStatusReturnType, getL2TransactionHashes, getWithdrawals } from 'viem/op-stack';

import { L1_CHAIN, L2_CHAIN } from '../constants';
import { ETH, wstETH } from '../constants/assets';
import { bridgeKeys, queryClient } from '../lib/react-query';
import { MessageDirection, MessageStatus, TransactionType } from '../types';

import { useBridgeTokens } from './useBridgeTokens';
import { usePublicClientL1, usePublicClientL2 } from './usePublicClient';

type BridgeTransaction = {
  from: Address;
  to: Address;
  l1Token: Address;
  l2Token: Address;
  amount: CurrencyAmount<Currency>;
  data: string;
  date: Date;
  blockNumber: number;
  transactionHash: Address;
  l1Receipt?: TransactionReceipt;
  l2Receipt?: TransactionReceipt;
  statusEndDate?: Date;
  direction: MessageDirection;
  status: MessageStatus | null;
  type: TransactionType.Bridge;
};

type Erc20TransactionResponse = {
  remoteToken: Address;
  localToken: Address;
} & EthTransactionResponse;

type EthTransactionResponse = {
  from: Address;
  to: Address;
  blockNumber: number;
  transactionHash: Address;
  timestamp: number;
  amount: bigint;
  data: string;
};

type BridgeTransactionResponse = {
  eth: EthTransactionResponse[];
  erc20: Erc20TransactionResponse[];
};

type WithdrawBridgeTransactionResponse = BridgeTransactionResponse & {
  westEth: Erc20TransactionResponse[];
};

const getDepositBridgeTransactions = gql`
  query getBridgeDeposits($address: String!) {
    eth: ethbridgeInitiateds(where: { from_starts_with_nocase: $address }) {
      from
      to
      blockNumber: block_number
      transactionHash: transactionHash_
      timestamp: timestamp_
      amount
      data: extraData
    }
    erc20: erc20BridgeInitiateds(where: { from_starts_with_nocase: $address }) {
      from
      to
      localToken
      remoteToken
      blockNumber: block_number
      transactionHash: transactionHash_
      timestamp: timestamp_
      amount
      data: extraData
    }
  }
`;

const getWithdrawBridgeTransactions = gql`
  query getBridgeDeposits($address: String!, $westEthAddress: String!) {
    eth: ethbridgeInitiateds(where: { from_starts_with_nocase: $address }) {
      from
      to
      blockNumber: block_number
      transactionHash: transactionHash_
      timestamp: timestamp_
      amount
      data: extraData
    }
    erc20: erc20BridgeInitiateds(where: { from_starts_with_nocase: $address }) {
      from
      to
      localToken
      remoteToken
      blockNumber: block_number
      transactionHash: transactionHash_
      timestamp: timestamp_
      amount
      data: extraData
    }
    westEth: withdrawalInitiateds(where: { from_starts_with_nocase: $address, l2Token: $westEthAddress }) {
      from
      to
      remoteToken: l1Token
      localToken: l2Token
      blockNumber: block_number
      transactionHash: transactionHash_
      timestamp: timestamp_
      amount
      data: extraData
    }
  }
`;

const { deposit: depositUrlPath, withdraw: withdrawUrlPath } = {
  [ChainId.BOB]: { deposit: 'bridge-deposits-mainnet/1.0/gn', withdraw: 'bridge-withdraws-bob/1.0/gn' },
  [ChainId.OLD_BOB_SEPOLIA]: {
    deposit: 'bridge-deposits-sepolia/1.0',
    withdraw: 'bridge-withdraws-bob-testnet/1.0/gn'
  },
  [ChainId.BOB_SEPOLIA]: {
    deposit: 'testnet-bridge-deposits-sepolia/test/gn',
    withdraw: 'testnet-bridge-withdraws-bob-sepolia/test/gn'
  }
}[L2_CHAIN];

const depositsUrl = `${process.env.NEXT_PUBLIC_INDEXER_URL}/${depositUrlPath}`;

const withdrawUrl = `${process.env.NEXT_PUBLIC_INDEXER_URL}/${withdrawUrlPath}`;

const mapStatus = {
  'waiting-to-prove': MessageStatus.STATE_ROOT_NOT_PUBLISHED,
  'ready-to-prove': MessageStatus.READY_TO_PROVE,
  'waiting-to-finalize': MessageStatus.IN_CHALLENGE_PERIOD,
  'ready-to-finalize': MessageStatus.READY_FOR_RELAY,
  finalized: MessageStatus.RELAYED
};

const getMessageStatus = (viemStatus: GetWithdrawalStatusReturnType) => {
  return mapStatus[viemStatus];
};

const getDepositRefetchInterval = ((query: any) => {
  if (!query.state.data) return undefined;

  switch (query.state.data.status as MessageStatus | null | undefined) {
    default:
    case MessageStatus.FAILED_L1_TO_L2_MESSAGE:
    case MessageStatus.RELAYED:
      return undefined;
    case MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE:
      return INTERVAL.SECONDS_30;
    case null:
    case undefined:
      return INTERVAL.SECONDS_10;
  }
}) as any;

const getWithdrawRefetchInterval = ((query: any) => {
  if (!query.state.data) return undefined;

  switch (query.state.data.status as MessageStatus | null | undefined) {
    default:
    case MessageStatus.RELAYED:
      return undefined;
    case MessageStatus.IN_CHALLENGE_PERIOD:
    case MessageStatus.STATE_ROOT_NOT_PUBLISHED:
      return INTERVAL.MINUTE;
    case MessageStatus.READY_TO_PROVE:
    case MessageStatus.READY_FOR_RELAY:
      return INTERVAL.SECONDS_15;
    case null:
    case undefined:
      return INTERVAL.SECONDS_10;
  }
}) as any;

const useGetBridgeTransactions = () => {
  const { address } = useAccount();
  const { data: tokens } = useBridgeTokens(L1_CHAIN, L2_CHAIN);
  const publicClientL1 = usePublicClientL1();
  const publicClientL2 = usePublicClientL2();

  const getTxReceipt = useCallback(
    async (address: Address, transactionHash: Address, chain: 'l1' | 'l2'): Promise<TransactionReceipt | undefined> => {
      const queryKey = bridgeKeys.receiptTransaction(address, transactionHash, chain);

      const cachedReceipt: TransactionReceipt | undefined = queryClient.getQueryData(queryKey);

      if (cachedReceipt) return cachedReceipt;

      const receipt = await (chain === 'l1' ? publicClientL1 : publicClientL2)
        .getTransactionReceipt({
          hash: transactionHash
        })
        .catch(() => undefined);

      if (receipt) {
        queryClient.setQueryDefaults(queryKey, { staleTime: Infinity });
        queryClient.setQueryData(queryKey, receipt);
      }

      return receipt;
    },
    [publicClientL1, publicClientL2]
  );

  const getDepositStatus = useCallback(
    async (transactionHash: Address) => {
      const l1Receipt = await getTxReceipt(address!, transactionHash, 'l1');

      if (!l1Receipt) {
        return { status: MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE };
      }

      if (l1Receipt.status === 'reverted') {
        return { status: MessageStatus.FAILED_L1_TO_L2_MESSAGE };
      }

      const [l2Hash] = getL2TransactionHashes(l1Receipt);

      const l2Receipt = await getTxReceipt(address!, l2Hash, 'l2');

      if (!l2Receipt) {
        return { l1Receipt, status: MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE };
      }

      if (l2Receipt.status === 'reverted') {
        return { status: MessageStatus.FAILED_L1_TO_L2_MESSAGE };
      }

      return {
        l1Receipt,
        l2Receipt,
        status: MessageStatus.RELAYED
      };
    },
    [getTxReceipt, address]
  );

  const getStatusEndDate = useCallback(
    async (status: GetWithdrawalStatusReturnType, l2Receipt: TransactionReceipt): Promise<Date | undefined> => {
      const queryKey = bridgeKeys.withdrawStatusTimeTransaction(address, l2Receipt.transactionHash, status);

      const cachedData: Date | undefined = queryClient.getQueryData(queryKey);

      if (cachedData) return cachedData;

      let remainingTime: number | undefined;

      switch (status) {
        case 'waiting-to-prove': {
          const timeToProve = await publicClientL1.getTimeToProve({
            receipt: l2Receipt,
            targetChain: publicClientL2.chain as any
          });

          remainingTime = timeToProve?.timestamp;
          break;
        }
        case 'waiting-to-finalize': {
          const [message] = getWithdrawals(l2Receipt);

          const timeToFinalize = await publicClientL1
            .getTimeToFinalize({
              withdrawalHash: message.withdrawalHash,
              targetChain: publicClientL1.chain as any
            })
            .catch(() => undefined);

          remainingTime = timeToFinalize?.timestamp;
          break;
        }
      }

      if (remainingTime) {
        queryClient.setQueryDefaults(queryKey, { staleTime: INTERVAL.HOUR, gcTime: INTERVAL.HOUR });
        queryClient.setQueryData(queryKey, remainingTime);
      }

      return remainingTime ? new Date(remainingTime) : undefined;
    },
    [address, publicClientL1, publicClientL2.chain]
  );

  const getWithdrawStatus = useCallback(
    async (transactionHash: Address) => {
      const l2Receipt = await getTxReceipt(address!, transactionHash, 'l2');

      if (!l2Receipt) {
        return { status: MessageStatus.STATE_ROOT_NOT_PUBLISHED };
      }

      const status = await publicClientL1
        .getWithdrawalStatus({
          receipt: l2Receipt,
          targetChain: publicClientL1.chain as any
        })
        .catch(() => null);

      const statusEndDate = status ? await getStatusEndDate(status, l2Receipt) : undefined;

      const queryKey = bridgeKeys.withdrawStatusTransaction(address, transactionHash);

      if (status) {
        queryClient.setQueryData(queryKey, status);

        return {
          l2Receipt,
          status: getMessageStatus(status),
          statusEndDate
        };
      }

      const fallbackStatus = (queryClient.getQueryData(queryKey) as GetWithdrawalStatusReturnType) || null;

      return {
        l2Receipt,
        status: getMessageStatus(fallbackStatus),
        statusEndDate
      };
    },
    [getTxReceipt, address, publicClientL1, getStatusEndDate]
  );

  const getEthDeposit = useCallback(
    async (depositData: EthTransactionResponse): Promise<BridgeTransaction | null> => {
      const token = tokens!.find((token) =>
        isAddressEqual(token.l1Token.address, ETH[L1_CHAIN as ChainId.ETHEREUM].address)
      );

      if (!token) return null;

      const amount = CurrencyAmount.fromRawAmount(token.l1Currency, depositData.amount || 0);

      const { status, l1Receipt, l2Receipt } = await getDepositStatus(depositData.transactionHash);

      return {
        ...depositData,
        amount,
        status,
        l1Receipt,
        l2Receipt,
        l1Token: ETH[L1_CHAIN as ChainId.ETHEREUM].address,
        l2Token: ETH[L2_CHAIN as ChainId.BOB].address,
        direction: MessageDirection.L1_TO_L2,
        date: new Date(depositData.timestamp * 1000),
        type: TransactionType.Bridge
      };
    },
    [getDepositStatus, tokens]
  );

  const getEthWithdraw = useCallback(
    async (withdrawData: EthTransactionResponse) => {
      const token = tokens!.find((token) =>
        isAddressEqual(token.l1Token.address, ETH[L1_CHAIN as ChainId.ETHEREUM].address)
      );

      if (!token) return null;

      const amount = CurrencyAmount.fromRawAmount(token.l1Currency, withdrawData.amount || 0);

      const { status, l2Receipt, statusEndDate } = await getWithdrawStatus(withdrawData.transactionHash);

      return {
        ...withdrawData,
        amount,
        status,
        l2Receipt,
        l1Token: ETH[L1_CHAIN as ChainId.ETHEREUM].address,
        l2Token: ETH[L2_CHAIN as ChainId.BOB].address,
        direction: MessageDirection.L2_TO_L1,
        statusEndDate,
        date: new Date(withdrawData.timestamp * 1000),
        type: TransactionType.Bridge
      };
    },
    [getWithdrawStatus, tokens]
  );

  const getErc20Deposit = useCallback(
    async (depositData: Erc20TransactionResponse): Promise<BridgeTransaction | null> => {
      const token = tokens!.find((token) => isAddressEqual(token.l1Token.address, depositData.localToken));

      if (!token) return null;

      const amount = CurrencyAmount.fromRawAmount(token.l1Currency, depositData.amount || 0);

      const { status, l1Receipt, l2Receipt } = await getDepositStatus(depositData.transactionHash);

      return {
        ...depositData,
        amount,
        status,
        l1Receipt,
        l2Receipt,
        l1Token: token.l1Token.address,
        l2Token: token.l2Token.address,
        direction: MessageDirection.L1_TO_L2,
        date: new Date(depositData.timestamp * 1000),
        type: TransactionType.Bridge
      };
    },
    [getDepositStatus, tokens]
  );

  const getErc20Withdraw = useCallback(
    async (withdrawData: Erc20TransactionResponse): Promise<BridgeTransaction | null> => {
      const token = tokens!.find((token) => isAddressEqual(token.l2Token.address, withdrawData.localToken));

      if (!token) return null;

      const amount = CurrencyAmount.fromRawAmount(token.l2Currency, withdrawData.amount || 0);

      const { status, l2Receipt, statusEndDate } = await getWithdrawStatus(withdrawData.transactionHash);

      return {
        ...withdrawData,
        amount,
        status,
        l2Receipt,
        l1Token: token.l1Token.address,
        l2Token: token.l2Token.address,
        direction: MessageDirection.L2_TO_L1,
        date: new Date(withdrawData.timestamp * 1000),
        statusEndDate,
        type: TransactionType.Bridge
      };
    },
    [getWithdrawStatus, tokens]
  );

  const fetchTransactions = useCallback(async (address: Address) => {
    const [deposits, withdraws] = await Promise.all([
      request<BridgeTransactionResponse>(depositsUrl, getDepositBridgeTransactions, { address }),
      request<WithdrawBridgeTransactionResponse>(withdrawUrl, getWithdrawBridgeTransactions, {
        address,
        westEthAddress: L2_CHAIN === ChainId.BOB_SEPOLIA ? undefined : wstETH[L2_CHAIN].address.toLowerCase()
      })
    ]);

    return { deposits, withdraws };
  }, []);

  const transactions = useQuery({
    queryKey: bridgeKeys.transactions(address),
    queryFn: async () => fetchTransactions(address!),
    enabled: Boolean(address && tokens),
    refetchInterval: INTERVAL.SECONDS_30,
    gcTime: INTERVAL.MINUTE,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  const getQueries = useCallback(() => {
    if (!transactions.data) return [];

    const enabled = !!transactions.data;

    const depositsEth = transactions.data.deposits.eth.map((tx) => ({
      queryKey: bridgeKeys.depositEthTransaction(address, tx.transactionHash),
      queryFn: () => getEthDeposit(tx),
      refetchInterval: getDepositRefetchInterval,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled
    }));

    const withdrawsEth = transactions.data.withdraws.eth.map((tx) => ({
      queryKey: bridgeKeys.withdrawEthTransaction(address, tx.transactionHash),
      queryFn: () => getEthWithdraw(tx),
      refetchInterval: getWithdrawRefetchInterval,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled
    }));

    const depositsErc20 = transactions.data.deposits.erc20.map((tx) => ({
      queryKey: bridgeKeys.depositErc20Transaction(address, tx.transactionHash),
      queryFn: () => getErc20Deposit(tx),
      refetchInterval: getDepositRefetchInterval,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled
    }));

    const erc20Withdrawals = [...transactions.data.withdraws.erc20, ...transactions.data.withdraws.westEth];

    const withdrawErc20 = erc20Withdrawals.map((tx) => ({
      queryKey: bridgeKeys.withdrawErc20Transaction(address, tx.transactionHash),
      queryFn: () => getErc20Withdraw(tx),
      refetchInterval: getWithdrawRefetchInterval,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled
    }));

    return [...depositsEth, ...depositsErc20, ...withdrawsEth, ...withdrawErc20];
  }, [transactions.data, address, getEthDeposit, getEthWithdraw, getErc20Deposit, getErc20Withdraw]);

  const queriesResult = useQueries({
    queries: getQueries(),
    combine: (results) => {
      return {
        data: results.map((result) => result.data).filter(Boolean) as BridgeTransaction[],
        isLoading:
          (!!address && !transactions.data && transactions.isPending) || results.some((result) => result.isPending)
      };
    }
  });

  const getTransaction = useCallback(
    (transactionHash: Address) =>
      queriesResult.data.find((item) => item.transactionHash.toLowerCase() === transactionHash.toLowerCase()),
    [queriesResult.data]
  );

  return { ...queriesResult, refetch: transactions.refetch, getTransaction };
};

export { useGetBridgeTransactions };
export type { BridgeTransaction };
