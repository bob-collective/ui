import { ChainId } from '@gobob/chains';
import { Currency, CurrencyAmount } from '@gobob/currency';
import { useQuery } from '@tanstack/react-query';
import request, { gql } from 'graphql-request';
import { Address, isAddressEqual } from 'viem';

import { CHAIN, INTERVAL } from '../constants';

import { useDynamicAddress } from './useDynamicAddress';
import { paymasters } from './useKernelClient';
import { TokenData, useTokens } from './useTokens';

type TransactionItemResponse = {
  from: Address;
  to: Address;
  blockNumber: number;
  transactionHash: Address;
  timestamp: number;
  amount: string;
  token: Address;
};

type TransactionsResponse = {
  receive: TransactionItemResponse[];
  sent: TransactionItemResponse[];
};

type TransactionData = {
  from: Address;
  to: Address;
  blockNumber: number;
  transactionHash: Address;
  date: Date;
  amount: CurrencyAmount<Currency>;
  tokenUrl: string;
  type: 'receive' | 'send';
};

const getTransactions = gql`
  query getTransactions($address: String!) {
    receive: transfers(where: { to_contains_nocase: $address }) {
      transactionHash: transactionHash_
      timestamp: timestamp_
      from
      to
      amount: value
      blockNumber: block_number
      token: contractId_
    }
    sent: transfers(where: { from_contains_nocase: $address }) {
      transactionHash: transactionHash_
      timestamp: timestamp_
      from
      to
      amount: value
      blockNumber: block_number
      token: contractId_
    }
  }
`;

const transactionsUrl = `${process.env.NEXT_PUBLIC_INDEXER_URL}/BOB-Pay-Tokens-bob/prod/gn`;

const transformData = (transactions: TransactionItemResponse[], tokens: TokenData[], type: 'receive' | 'send') =>
  transactions.reduce((acc: TransactionData[], tx) => {
    // Filter out invalid addresses
    if (
      isAddressEqual(tx.from, '0x0000000000000000000000000000000000000000') ||
      isAddressEqual(tx.to, '0x0000000000000000000000000000000000000000')
    ) {
      return acc;
    }

    // Find the token associated with the transaction
    const token = tokens.find((token) => isAddressEqual(tx.token, token.raw.address));

    if (!token) return acc;

    const paymasterAddress = paymasters[CHAIN as ChainId.BOB][token.currency.symbol];

    // Filter out transactions involving the paymaster address
    if (paymasterAddress && (isAddressEqual(tx.from, paymasterAddress) || isAddressEqual(tx.to, paymasterAddress))) {
      return acc;
    }

    // Transform the transaction
    const transformedTx: TransactionData = {
      date: new Date(tx.timestamp * 1000),
      amount: CurrencyAmount.fromRawAmount(token.currency, tx.amount),
      blockNumber: tx.blockNumber,
      from: tx.from,
      to: tx.to,
      transactionHash: tx.transactionHash,
      tokenUrl: token.raw.logoUrl,
      type
    };

    acc.push(transformedTx);

    return acc;
  }, []);

const useGetTransactions = () => {
  const address = useDynamicAddress();
  const { data: tokens } = useTokens(CHAIN);

  return useQuery({
    queryKey: ['aa-transaction', address],
    queryFn: async (): Promise<TransactionData[]> => {
      const { receive, sent } = await request<TransactionsResponse>(transactionsUrl, getTransactions, { address });

      return [...transformData(receive, tokens, 'receive'), ...transformData(sent, tokens, 'send')];
    },
    enabled: Boolean(address),
    refetchInterval: INTERVAL.SECONDS_30,
    gcTime: INTERVAL.MINUTE,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    select: (data) => {
      return data.sort((a, b) => b.date.getTime() - a.date.getTime());
    }
  });
};

export { useGetTransactions };
export type { TransactionData };
