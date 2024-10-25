'use client';

import { GatewayQuoteParams } from '@gobob/bob-sdk';
import { Bitcoin, CurrencyAmount } from '@gobob/currency';
import { INTERVAL, UndefinedInitialDataOptions, useQuery, useQueryClient } from '@gobob/react-query';
import { useAccount as useSatsAccount } from '@gobob/sats-wagmi';
import { useAccount } from '@gobob/wagmi';

import { DEFAULT_GATEWAY_QUOTE_PARAMS } from '../constants/quote';

import { useGatewayLiquidity } from './useGatewayLiquidity';

import { gatewaySDK } from '@/lib/bob-sdk';
import { bridgeKeys } from '@/lib/react-query';

type UseGatewayQuoteReturnType = Awaited<ReturnType<typeof gatewaySDK.getQuote>> | undefined;

type UseGatewayLiquidityProps<TData = UseGatewayQuoteReturnType> = Partial<
  Pick<GatewayQuoteParams, 'toChain' | 'toToken' | 'strategyAddress'>
> & {
  amount?: CurrencyAmount<Bitcoin>;
  isGasNeeded?: boolean;
  query?: Omit<
    UndefinedInitialDataOptions<UseGatewayQuoteReturnType, Error, TData, (string | number | boolean | undefined)[]>,
    'queryKey' | 'queryFn'
  >;
};

const useGatewayQuote = <TData = UseGatewayQuoteReturnType>({
  amount,
  toChain,
  toToken,
  strategyAddress,
  isGasNeeded = false,
  query
}: UseGatewayLiquidityProps<TData>) => {
  const queryClient = useQueryClient();

  const { address: evmAddress } = useAccount();
  const { address: btcAddress } = useSatsAccount();

  const liquidityQuery = useGatewayLiquidity({
    isGasNeeded,
    toChain,
    toToken,
    strategyAddress
  });

  const enabled = Boolean(
    btcAddress &&
      evmAddress &&
      liquidityQuery.data?.hasLiquidity &&
      amount &&
      (query?.enabled !== undefined ? query.enabled : true)
  );

  const queryKey = bridgeKeys.btcQuote(toToken, toChain, strategyAddress, Number(amount?.numerator));

  const queryResult = useQuery({
    enabled,
    queryKey,
    refetchInterval: INTERVAL.SECONDS_30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (!amount || !toChain || !toToken) return;

      const atomicAmount = amount.numerator.toString();

      return gatewaySDK.getQuote({
        ...DEFAULT_GATEWAY_QUOTE_PARAMS,
        amount: atomicAmount,
        gasRefill: isGasNeeded ? DEFAULT_GATEWAY_QUOTE_PARAMS.gasRefill : 0,
        toChain,
        toToken,
        strategyAddress
      });
    },
    ...query
  });

  return {
    ...queryResult,
    remove: () => queryClient.removeQueries({ queryKey })
  };
};

export { useGatewayQuote };
