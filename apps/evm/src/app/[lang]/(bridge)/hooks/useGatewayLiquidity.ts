'use client';

import { Bitcoin, CurrencyAmount } from '@gobob/currency';
import { INTERVAL, UndefinedInitialDataOptions, useQuery } from '@gobob/react-query';
import { BITCOIN } from '@gobob/tokens';
import { GatewayQuoteParams } from '@gobob/bob-sdk';

import { DEFAULT_GATEWAY_QUOTE_PARAMS } from '../constants/quote';
import { getMinAmount } from '../utils/deposit';

import { gatewaySDK } from '@/lib/bob-sdk';
import { bridgeKeys } from '@/lib/react-query';

type UseGatewayLiquidityProps = Partial<Pick<GatewayQuoteParams, 'toChain' | 'toToken' | 'strategyAddress'>> & {
  isGasNeeded?: boolean;
  query?: Omit<
    UndefinedInitialDataOptions<
      { liquidityAmount: CurrencyAmount<Bitcoin>; hasLiquidity: boolean } | undefined,
      Error,
      { liquidityAmount: CurrencyAmount<Bitcoin>; hasLiquidity: boolean } | undefined,
      (string | number | boolean | undefined)[]
    >,
    'queryKey' | 'queryFn' | 'select'
  >;
};

const useGatewayLiquidity = ({
  toChain,
  toToken,
  strategyAddress,
  isGasNeeded = false,
  query
}: UseGatewayLiquidityProps) =>
  useQuery({
    enabled: Boolean(toToken || toChain),
    queryKey: bridgeKeys.btcQuote(toToken, toChain, strategyAddress, 'max'),
    refetchInterval: INTERVAL.MINUTE,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (!toChain || !toToken) return;

      const quote = await gatewaySDK.getQuote({
        ...DEFAULT_GATEWAY_QUOTE_PARAMS,
        toChain,
        toToken,
        strategyAddress,
        amount: undefined
      });

      const liquidityAmount = CurrencyAmount.fromRawAmount(BITCOIN, quote.satoshis);

      const minDepositAmount = getMinAmount(isGasNeeded);

      return { liquidityAmount, hasLiquidity: liquidityAmount.greaterThan(minDepositAmount) };
    },
    ...query
  });

export { useGatewayLiquidity };
