import { CurrencyAmount, Token } from '@gobob/currency';
import { INTERVAL, useQuery } from '@gobob/react-query';
import { useAccount } from '@gobob/wagmi';
import { Address } from 'viem';
import { ChainId } from '@gobob/chains';
import { useStore } from '@tanstack/react-store';
import { useCallback } from 'react';

import { gatewaySDK } from '../lib/bob-sdk';
import { esploraClient } from '../utils';
import { GatewayDepositSteps } from '../constants';
import { GatewayTransaction, TransactionType } from '../types';
import { store } from '../lib/store';

import { FeatureFlags, useFeatureFlag } from './useFeatureFlag';

const getGatewayTransactions = async (address: Address): Promise<GatewayTransaction[]> => {
  const [orders, latestHeight] = await Promise.all([gatewaySDK.getOrders(address), esploraClient.getLatestHeight()]);

  return (
    await Promise.all(
      orders.map(async (order): Promise<GatewayTransaction | undefined> => {
        const gatewayToken = order.getToken();
        const gatewayAmount = order.getAmount();

        if (!gatewayToken || !gatewayAmount) {
          return undefined;
        }

        const token = {
          raw: {
            chainId: gatewayToken.chainId,
            address: gatewayToken.address as `0x${string}`,
            name: gatewayToken.name,
            symbol: gatewayToken.symbol,
            decimals: gatewayToken.decimals,
            logoUrl: gatewayToken.logoURI,
            apiId: ''
          },
          currency: new Token(
            ChainId.BOB,
            gatewayToken.address as `0x${string}`,
            gatewayToken.decimals,
            gatewayToken.symbol,
            gatewayToken.name
          )
        };

        const amount = CurrencyAmount.fromRawAmount(token.currency, gatewayAmount);

        const orderStatus = await order.getStatus(esploraClient, latestHeight);
        const status: GatewayDepositSteps =
          orderStatus.confirmed === false
            ? 'btc-confirmation'
            : !!orderStatus.pending
              ? 'l2-processing'
              : orderStatus.success
                ? 'l2-confirmation'
                : 'l2-incomplete';

        const isPending = status === 'btc-confirmation' || status === 'l2-processing';

        return {
          amount,
          btcTxId: order.txid,
          date: new Date(order.timestamp * 1000),
          confirmations: orderStatus.data.confirmations,
          totalConfirmations: order.txProofDifficultyFactor,
          status,
          type: TransactionType.Gateway,
          isPending
        };
      })
    )
  ).filter(Boolean) as GatewayTransaction[];
};

const useGetGatewayTransactions = () => {
  const { address } = useAccount();
  const isBtcGatewayEnabled = useFeatureFlag(FeatureFlags.BTC_GATEWAY);

  const unconfirmedTransactions = useStore(store, (state) => state.bridge.transactions.gateway.unconfirmed);

  const queryResult = useQuery({
    queryKey: ['gateway-transactions', address],
    queryFn: async () => getGatewayTransactions(address!),
    enabled: Boolean(address && isBtcGatewayEnabled),
    refetchInterval: INTERVAL.SECONDS_30,
    gcTime: INTERVAL.MINUTE,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    select: (data) => {
      const unmatchedUnconfirmedTransactions = unconfirmedTransactions.filter(
        (tx) => !data.some((confirmedTx) => confirmedTx.btcTxId.toLowerCase() === tx.btcTxId.toLowerCase())
      );

      return [...data, ...unmatchedUnconfirmedTransactions];
    }
  });

  const getTransaction = useCallback(
    (btcTxId: string) => queryResult.data?.find((item) => item.btcTxId.toLowerCase() === btcTxId.toLowerCase()),
    [queryResult.data]
  );

  const addPlaceholderTransaction = (data: GatewayTransaction) => {
    store.setState((state) => ({
      ...state,
      bridge: {
        transactions: {
          ...state.bridge.transactions,
          gateway: {
            ...state.bridge.transactions.bridge,
            unconfirmed: [...state.bridge.transactions.gateway.unconfirmed, data]
          }
        }
      }
    }));
  };

  return {
    ...queryResult,
    getTransaction,
    addPlaceholderTransaction
  };
};

export { useGetGatewayTransactions };
export type { GatewayTransaction };
