import { Currency, CurrencyAmount } from '@gobob/currency';
import { useQuery } from '@gobob/react-query';
import { Address, useAccount } from '@gobob/wagmi';
import request, { gql } from 'graphql-request';
import { isAddressEqual } from 'viem';
import { ChainId } from '@gobob/chains';

import { CHAIN } from '../constants';

import { TokenData, useTokens } from './useTokens';
import { paymasters } from './useKernelClient';

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

const transactionsUrl = `${import.meta.env.VITE_INDEXER_URL}/BOB-Pay-Tokens-bob/prod/gn`;

const transformData = (transactions: TransactionItemResponse[], tokens: TokenData[], type: 'receive' | 'send') =>
  transactions
    .filter(
      (tx) =>
        !(
          isAddressEqual(tx.from, '0x0000000000000000000000000000000000000000') ||
          isAddressEqual(tx.to, '0x0000000000000000000000000000000000000000')
        )
    )
    .map((tx): TransactionData | null => {
      const token = tokens!.find((token) => isAddressEqual(tx.token, token.raw.address));

      if (!token) return null;

      if (
        isAddressEqual(tx.from, paymasters[CHAIN as ChainId.BOB][token.currency.symbol]) ||
        isAddressEqual(tx.to, paymasters[CHAIN as ChainId.BOB][token.currency.symbol])
      ) {
        return null;
      }

      return {
        date: new Date(tx.timestamp * 1000),
        amount: CurrencyAmount.fromRawAmount(token.currency, tx.amount),
        blockNumber: tx.blockNumber,
        from: tx.from,
        to: tx.to,
        transactionHash: tx.transactionHash,
        tokenUrl: token.raw.logoUrl,
        type
      };
    })
    .filter(Boolean) as TransactionData[];

const useGetTransactions = () => {
  const { address } = useAccount();
  const { data: tokens } = useTokens(CHAIN);

  return useQuery({
    queryKey: ['aa-transaction', address],
    queryFn: async (): Promise<TransactionData[]> => {
      const { receive, sent } = await request<TransactionsResponse>(transactionsUrl, getTransactions, { address });

      return [...transformData(receive, tokens, 'receive'), ...transformData(sent, tokens, 'send')];
    },
    enabled: Boolean(address),
    // refetchInterval: INTERVAL.SECONDS_30,
    // gcTime: INTERVAL.MINUTE,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });
};

export { useGetTransactions };
export type { TransactionData };
