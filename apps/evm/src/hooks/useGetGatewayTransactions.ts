import { CurrencyAmount, ERC20Token, Token } from '@gobob/currency';
import { INTERVAL, useQuery } from '@gobob/react-query';
import { useAccount } from '@gobob/wagmi';
import { Address } from 'viem';
import { ChainId } from '@gobob/chains';

import { gatewaySDK } from '../lib/bob-sdk';
import { electrsClient } from '../utils';
import { GatewayDepositSteps } from '../constants';
import { TransactionType } from '../types';

import { FeatureFlags, useFeatureFlag } from './useFeatureFlag';

type GatewayTransaction = {
  status: GatewayDepositSteps;
  date: Date;
  confirmations: number;
  totalConfirmations: number;
  btcTxId: string;
  amount?: CurrencyAmount<ERC20Token>;
  type: TransactionType.Gateway;
};

const getGatewayTransactions = async (address: Address): Promise<GatewayTransaction[]> => {
  const [orders, latestBlock] = await Promise.all([gatewaySDK.getOrders(address), electrsClient.getLatestBlock()]);

  return (
    await Promise.all(
      orders.map(async (order): Promise<GatewayTransaction | undefined> => {
        const gatewayToken = order.outputToken ? order.outputToken : order.baseToken;
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

        // TODO: move this to the SDK
        const amount = order.strategyAddress
          ? order.outputTokenAmount
            ? CurrencyAmount.fromRawAmount(token.currency as ERC20Token, order.outputTokenAmount)
            : undefined
          : CurrencyAmount.fromRawAmount(token.currency as ERC20Token, order.satoshis - order.fee);

        const txStatus = await electrsClient.getTxStatus(order.txid);

        const confirmations = txStatus.confirmed ? Number(latestBlock) - txStatus.block_height + 1 : 0;
        const hasEnoughConfirmations = confirmations >= order.txProofDifficultyFactor;

        const status: GatewayDepositSteps = !hasEnoughConfirmations
          ? 'btc-confirmation'
          : order.status
            ? 'l2-confirmation'
            : 'l2-processing';

        return {
          amount,
          btcTxId: order.txid,
          date: new Date(order.timestamp * 1000),
          confirmations,
          totalConfirmations: order.txProofDifficultyFactor,
          status,
          type: TransactionType.Gateway
        };
      })
    )
  ).filter(Boolean) as GatewayTransaction[];
};

const useGetGatewayTransactions = () => {
  const { address } = useAccount();
  const isBtcGatewayEnabled = useFeatureFlag(FeatureFlags.BTC_GATEWAY);

  return useQuery({
    queryKey: ['gateway-transactions', address],
    queryFn: async () => getGatewayTransactions(address!),
    enabled: Boolean(address && isBtcGatewayEnabled),
    refetchInterval: INTERVAL.SECONDS_30,
    gcTime: INTERVAL.MINUTE,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });
};

export { useGetGatewayTransactions };
export type { GatewayTransaction };
