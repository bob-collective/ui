import { CurrencyAmount, ERC20Token, Token } from '@gobob/currency';
import { INTERVAL, UndefinedInitialDataOptions, useQuery } from '@gobob/react-query';
import { useAccount } from '@gobob/wagmi';
import { Address } from 'viem';
import { ChainId } from '@gobob/chains';
import { GatewayOrder } from '@gobob/bob-sdk';

import { FeatureFlags, useFeatureFlag } from '../../../../hooks';

import { gatewaySDK } from '@/lib/bob-sdk';
import { esploraClient } from '@/utils';
import { GatewayDepositSteps } from '@/constants';
import { GatewayTransactionType, TransactionType } from '@/types';

type GatewayTransaction = {
  status: GatewayDepositSteps;
  date: Date;
  confirmations: number;
  totalConfirmations: number;
  btcTxId: string;
  amount?: CurrencyAmount<ERC20Token>;
  type: TransactionType.Gateway;
  subType: GatewayTransactionType;
  isPending: boolean;
  order: GatewayOrder;
};

const getGatewayTransactions = async (address: Address): Promise<GatewayTransaction[]> => {
  const [orders, latestHeight] = await Promise.all([gatewaySDK.getOrders(address), esploraClient.getLatestHeight()]);

  return (
    await Promise.all(
      orders.map(async (order): Promise<GatewayTransaction | undefined> => {
        const gatewayToken = order.getToken();
        const gatewayAmount = order.getTokenAmount();

        let amount: CurrencyAmount<ERC20Token> | undefined;

        if (gatewayToken && gatewayAmount) {
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

          amount = CurrencyAmount.fromRawAmount(token.currency as ERC20Token, gatewayAmount);
        }

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
          subType: order.strategyAddress ? GatewayTransactionType.STAKE : GatewayTransactionType.BRIDGE,
          isPending,
          order
        };
      })
    )
  ).filter(Boolean) as GatewayTransaction[];
};

type GetGatewayTransactionsReturnType = GatewayTransaction[];

type UseFeeRateProps<TData = GetGatewayTransactionsReturnType> = {
  query?: Omit<
    UndefinedInitialDataOptions<GetGatewayTransactionsReturnType, Error, TData, (string | undefined)[]>,
    'queryKey' | 'queryFn' | 'enabled'
  >;
};

const useGetGatewayTransactions = ({ query }: UseFeeRateProps = {}) => {
  const { address } = useAccount();
  const isBtcGatewayEnabled = useFeatureFlag(FeatureFlags.BTC_GATEWAY);

  return useQuery({
    queryKey: ['gateway-transactions', address],
    queryFn: () => getGatewayTransactions(address!),
    enabled: Boolean(address && isBtcGatewayEnabled),
    refetchInterval: INTERVAL.SECONDS_30,
    gcTime: INTERVAL.MINUTE,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...query
  });
};

export { useGetGatewayTransactions };
export type { GatewayTransaction };
