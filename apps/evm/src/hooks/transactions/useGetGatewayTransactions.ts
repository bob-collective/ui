import { ChainId } from '@gobob/chains';
import { CurrencyAmount, ERC20Token, Token } from '@gobob/currency';
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';
import { Address, getAddress } from 'viem';
import { useAccount } from 'wagmi';

import { INTERVAL, RawToken, tokens } from '@/constants';
import { gatewaySDK } from '@/lib/bob-sdk';
import { GatewaySteps, GatewayTransaction, GatewayTransactionType, TransactionType } from '@/types';
import { esploraClient } from '@/utils';

const tokenAddressToRawTokenMapping = tokens.reduce(
  (acc, cur) => {
    acc[getAddress(cur.address)] = cur;

    return acc;
  },
  {} as Record<Address, RawToken>
);

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
              icon: tokenAddressToRawTokenMapping[getAddress(gatewayToken.address)]?.icon,
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
        const status: GatewaySteps =
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
          logoUrl: gatewayToken?.logoURI,
          icon: gatewayToken?.address
            ? tokenAddressToRawTokenMapping[getAddress(gatewayToken.address)]?.icon
            : undefined,
          btcTxId: order.txid,
          date: new Date(order.timestamp * 1000),
          confirmations: orderStatus.data.confirmations,
          totalConfirmations: order.txProofDifficultyFactor,
          status,
          type: TransactionType.Gateway,
          subType: order.strategyAddress ? GatewayTransactionType.STRATEGY : GatewayTransactionType.BRIDGE,
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

  return useQuery({
    queryKey: ['gateway-transactions', address],
    queryFn: () => getGatewayTransactions(address!),
    enabled: Boolean(address),
    refetchInterval: INTERVAL.SECONDS_30,
    gcTime: INTERVAL.MINUTE,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...query
  });
};

export { useGetGatewayTransactions };
