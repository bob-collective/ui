'use client';

import { GatewayQuoteParams } from '@gobob/bob-sdk';
import { Bitcoin, CurrencyAmount } from '@gobob/currency';
import { INTERVAL, Optional, useMutation, useQuery, useQueryClient } from '@gobob/react-query';
import {
  useAccount as useSatsAccount,
  useBalance as useSatsBalance,
  useFeeEstimate as useSatsFeeEstimate,
  useFeeRate as useSatsFeeRate
} from '@gobob/sats-wagmi';
import { BITCOIN } from '@gobob/tokens';
import { toast } from '@gobob/ui';
import { Address, useAccount } from '@gobob/wagmi';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useEffect, useMemo, useState } from 'react';
import * as Sentry from '@sentry/nextjs';

import { DUST_THRESHOLD } from '../constants/deposit';
import { DEFAULT_GATEWAY_QUOTE_PARAMS } from '../constants/quote';

import { useGetTransactions } from '@/hooks';
import { gatewaySDK } from '@/lib/bob-sdk';
import { bridgeKeys } from '@/lib/react-query';
import {
  GatewayData,
  GatewayTransactionFee,
  GatewayTransactionSpeed,
  GatewayTransactionSpeedData,
  GatewayTransactionType
} from '@/types';

const getMinAmount = (isTopUpEnabled: boolean) => {
  const atomicAmount = isTopUpEnabled ? DUST_THRESHOLD + DEFAULT_GATEWAY_QUOTE_PARAMS.gasRefill : DUST_THRESHOLD;

  return CurrencyAmount.fromRawAmount(BITCOIN, atomicAmount);
};

const getBalanceAmount = (
  balance?: bigint,
  feeAmount?: CurrencyAmount<Bitcoin>,
  liquidityAmount?: CurrencyAmount<Bitcoin>
) => {
  if (!balance || !feeAmount || !liquidityAmount) {
    return CurrencyAmount.fromRawAmount(BITCOIN, 0n);
  }

  const balanceAmount = CurrencyAmount.fromRawAmount(BITCOIN, balance);

  if (balanceAmount.lessThan(feeAmount)) {
    return CurrencyAmount.fromRawAmount(BITCOIN, 0n);
  }

  const availableBalance = balanceAmount.subtract(feeAmount);

  if (availableBalance.greaterThan(liquidityAmount)) {
    return liquidityAmount;
  }

  return availableBalance;
};

type UseGatewayLiquidityProps = Partial<Pick<GatewayQuoteParams, 'toChain' | 'toToken' | 'strategyAddress'>> & {
  amount?: string;
  onMutate?: (data: Optional<GatewayData, 'amount'>) => void;
  onSuccess?: (data: GatewayData) => void;
  onError?: () => void;
};

const useGateway = ({
  amount: rawAmount,
  toChain,
  toToken,
  strategyAddress,
  onError,
  onMutate,
  onSuccess
}: UseGatewayLiquidityProps) => {
  const { i18n } = useLingui();
  const queryClient = useQueryClient();

  const { address: evmAddress } = useAccount();

  const { address: btcAddress, connector: satsConnector } = useSatsAccount();
  const { data: satsBalance } = useSatsBalance();

  const [isTopUpEnabled, setTopUpEnabled] = useState(true);
  const [selectedFee, setSelectedFee] = useState<GatewayTransactionFee>({ speed: GatewayTransactionSpeed.SLOW });

  const isStaking = !!strategyAddress;

  const minAmount = useMemo(() => getMinAmount(isTopUpEnabled), [isTopUpEnabled]);

  const { refetchGatewayTxs } = useGetTransactions();

  const liquidity = useQuery({
    enabled: Boolean(toToken || toChain),
    queryKey: bridgeKeys.btcQuote(toToken, toChain, strategyAddress, 'liquidity-check'),
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

      return { liquidityAmount, hasLiquidity: liquidityAmount.greaterThan(minAmount) };
    }
  });

  const {
    data: feeRateData,
    isLoading: isSatsFeeRateLoading,
    error: satsFeeRateError
  } = useSatsFeeRate({
    query: {
      select: ({ esplora, memPool }): GatewayTransactionSpeedData => {
        return {
          fastest: Math.ceil(Math.min(esplora[2], memPool.fastestFee)),
          fast: Math.ceil(Math.min(esplora[4], memPool.halfHourFee)),
          slow: Math.ceil(Math.min(esplora[4], memPool.hourFee)),
          minimum: Math.ceil(Math.min(esplora[1008], memPool.minimumFee))
        };
      }
    }
  });

  const feeRate = selectedFee.speed === 'custom' ? selectedFee.networkRate : feeRateData?.[selectedFee.speed];

  const {
    data: feeEstimate,
    isLoading: isFeeEstimateLoading,
    error: feeEstimateError
  } = useSatsFeeEstimate({
    opReturnData: evmAddress,
    feeRate: feeRate,
    query: {
      enabled: Boolean(satsBalance && satsBalance.confirmed > 0n && evmAddress),
      select: (data) => CurrencyAmount.fromRawAmount(BITCOIN, data.amount)
    }
  });

  const feeError = feeEstimateError || satsFeeRateError;

  useEffect(() => {
    if (feeError) {
      toast.error(t(i18n)`Failed to get estimated fee`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeError]);

  const quoteEnabled = Boolean(btcAddress && evmAddress && liquidity.data?.hasLiquidity && rawAmount);

  const queryKey = bridgeKeys.btcQuote(toToken, toChain, strategyAddress, rawAmount);

  const quoteQueryResult = useQuery({
    enabled: quoteEnabled,
    queryKey,
    refetchInterval: INTERVAL.SECONDS_30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (!rawAmount || !toChain || !toToken) return;

      const amount = CurrencyAmount.fromBaseAmount(BITCOIN, rawAmount);

      const quote = await gatewaySDK.getQuote({
        ...DEFAULT_GATEWAY_QUOTE_PARAMS,
        amount: amount.numerator.toString(),
        gasRefill: isTopUpEnabled ? DEFAULT_GATEWAY_QUOTE_PARAMS.gasRefill : 0,
        toChain,
        toToken,
        strategyAddress
      });

      return {
        amount,
        quote
      };
    },
    select: (data) => {
      if (!data) return;

      const protocolFeeAmount = CurrencyAmount.fromRawAmount(BITCOIN, data.quote.fee);

      const quoteAmount = data.amount.subtract(protocolFeeAmount);

      return {
        amount: quoteAmount,
        protocolFee: protocolFeeAmount,
        data: data
      };
    }
  });

  const mutation = useMutation({
    mutationKey: bridgeKeys.btcDeposit(evmAddress, btcAddress),
    mutationFn: async ({ evmAddress }: { evmAddress: Address }) => {
      if (!satsConnector) {
        throw new Error('Connector missing');
      }

      if (!quoteQueryResult.data) {
        throw new Error('Quote Data missing');
      }

      if (!feeEstimate) {
        throw new Error('Fee estimate missing');
      }

      if (!toChain) {
        throw new Error('Something went wrong');
      }

      const { data: quoteData, amount: quoteAmount, protocolFee } = quoteQueryResult.data;

      const data: GatewayData = {
        type: isStaking ? GatewayTransactionType.STAKE : GatewayTransactionType.BRIDGE,
        amount: quoteAmount,
        fee: protocolFee.add(feeEstimate)
      };

      onMutate?.(data);

      const { uuid, psbtBase64 } = await gatewaySDK.startOrder(quoteData.quote, {
        ...DEFAULT_GATEWAY_QUOTE_PARAMS,
        toChain,
        toUserAddress: evmAddress,
        fromUserAddress: satsConnector.paymentAddress!,
        fromUserPublicKey: satsConnector.publicKey,
        gasRefill: isTopUpEnabled ? DEFAULT_GATEWAY_QUOTE_PARAMS.gasRefill : 0,
        feeRate
      });

      const bitcoinTxHex = await satsConnector.signAllInputs(psbtBase64!);

      // NOTE: user does not broadcast the tx, that is done by
      // the relayer after it is validated
      const txid = await gatewaySDK.finalizeOrder(uuid, bitcoinTxHex);

      return { ...data, txid };
    },
    onSuccess: (data) => {
      onSuccess?.(data);
      refetchGatewayTxs();

      queryClient.removeQueries({ queryKey });
    },
    onError: (error) => {
      toast.error(error.message);
      onError?.();

      Sentry.captureException(error);
    }
  });

  const fee = useMemo(
    () => ({
      rateData: feeRateData,
      rate: feeRate,
      amount: feeEstimate,
      selectedFee,
      setSelectedFee: setSelectedFee,
      isLoading: isFeeEstimateLoading || isSatsFeeRateLoading
    }),
    [feeRate, feeRateData, isFeeEstimateLoading, isSatsFeeRateLoading, feeEstimate, selectedFee]
  );

  const balance = useMemo(
    () => getBalanceAmount(satsBalance?.confirmed, feeEstimate, liquidity.data?.liquidityAmount),
    [liquidity.data?.liquidityAmount, satsBalance?.confirmed, feeEstimate]
  );

  return {
    balance,
    mutation,
    fee,
    isTopUpEnabled,
    setTopUpEnabled,
    minAmount,
    liquidity,
    quote: quoteQueryResult
  };
};

export { useGateway };
