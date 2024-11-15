'use client';

import { GatewayQuoteParams } from '@gobob/bob-sdk';
import { Bitcoin, CurrencyAmount, ERC20Token } from '@gobob/currency';
import {
  INTERVAL,
  Optional,
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult
} from '@gobob/react-query';
import {
  BtcAddressType,
  FeeRateReturnType,
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
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';
import * as Sentry from '@sentry/nextjs';
import { DebouncedState, useDebounceValue } from 'usehooks-ts';
import { isAddress } from 'viem';

import { gatewaySDK } from '@/lib/bob-sdk';
import { bridgeKeys } from '@/lib/react-query';
import {
  GatewayTransactionFee,
  GatewayTransactionSpeed,
  GatewayTransactionSpeedData,
  GatewayTransactionType,
  InitGatewayTransaction,
  TransactionType
} from '@/types';

const DUST_THRESHOLD = 1000;

const GAS_REFILL = 2000;

const DEFAULT_GATEWAY_QUOTE_PARAMS: Required<Pick<GatewayQuoteParams, 'fromChain' | 'fromToken'>> = {
  fromChain: 'bitcoin',
  fromToken: 'BTC'
};

// TODO: base this on exchange rate
const getMinAmount = (isTopUpEnabled: boolean) => {
  const atomicAmount = isTopUpEnabled ? DUST_THRESHOLD + GAS_REFILL : DUST_THRESHOLD;

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

const feeRatesSelect = ({ esplora, memPool }: FeeRateReturnType): GatewayTransactionSpeedData => {
  return {
    fastest: Math.ceil(Math.min(esplora[2], memPool.fastestFee)),
    fast: Math.ceil(Math.min(esplora[4], memPool.halfHourFee)),
    slow: Math.ceil(Math.min(esplora[4], memPool.hourFee)),
    minimum: Math.ceil(Math.min(esplora[1008], memPool.minimumFee))
  };
};

type UseQuoteDataReturnType = {
  amount: CurrencyAmount<Bitcoin>;
  protocolFee: CurrencyAmount<Bitcoin>;
  data: Awaited<ReturnType<typeof gatewaySDK.getQuote>>;
};

type UseLiquidityDataReturnType = {
  liquidityAmount: CurrencyAmount<Bitcoin>;
  hasLiquidity: boolean;
};

type UseGatewayQueryDataReturnType = {
  fee: {
    rates: UseQueryResult<GatewayTransactionSpeedData, Error>;
    estimate: UseQueryResult<CurrencyAmount<Bitcoin>, Error>;
  };
  liquidity: UseQueryResult<UseLiquidityDataReturnType | undefined>;
  quote: UseQueryResult<UseQuoteDataReturnType | undefined>;
  minAmount: CurrencyAmount<Bitcoin>;
  balance: CurrencyAmount<Bitcoin>;
};

type StakeParams = {
  type: GatewayTransactionType.STAKE;
  assetName?: string;
} & Partial<Pick<GatewayQuoteParams, 'toChain' | 'toToken' | 'strategyAddress'>>;

type BridgeParams = {
  type: GatewayTransactionType.BRIDGE;
  token?: ERC20Token;
} & Partial<Pick<GatewayQuoteParams, 'toChain' | 'toToken'>>;

type UseGatewayLiquidityProps = {
  params: BridgeParams | StakeParams;
  onMutate?: (data: Optional<InitGatewayTransaction, 'amount'>) => void;
  onSuccess?: (data: InitGatewayTransaction) => void;
  onError?: () => void;
};

type UseGatewayReturnType = {
  query: UseGatewayQueryDataReturnType;
  mutation: UseMutationResult<
    InitGatewayTransaction,
    Error,
    {
      evmAddress: Address | string;
    },
    unknown
  >;
  isReady: boolean;
  isDisabled: boolean;
  type: GatewayTransactionType;
  settings: {
    topUp: {
      isEnabled: boolean;
      enable: Dispatch<SetStateAction<boolean>>;
    };
    fee: {
      rate: number | undefined;
      setFee: Dispatch<SetStateAction<GatewayTransactionFee>>;
      selected: GatewayTransactionFee;
    };
  };
  amount: string;
  setAmount: DebouncedState<(value: string) => void>;
  isTapRootAddress: boolean;
};

const useGateway = ({ params, onError, onMutate, onSuccess }: UseGatewayLiquidityProps): UseGatewayReturnType => {
  const { i18n } = useLingui();
  const queryClient = useQueryClient();

  const { address: evmAddress } = useAccount();

  const { address: btcAddress, connector: satsConnector, addressType: btcAddressType } = useSatsAccount();
  const { data: satsBalance } = useSatsBalance();

  const [isTopUpEnabled, setTopUpEnabled] = useState(true);
  const [selectedFee, setSelectedFee] = useState<GatewayTransactionFee>({ speed: GatewayTransactionSpeed.SLOW });

  const [rawAmount, setAmount] = useDebounceValue('', 300);

  const minAmount = useMemo(() => getMinAmount(isTopUpEnabled), [isTopUpEnabled]);

  const isTapRootAddress = btcAddressType === BtcAddressType.p2tr;

  const liquidityQueryEnabled = Boolean(
    params.toChain && params.toToken && params.type === GatewayTransactionType.STAKE
      ? params.strategyAddress
      : true && !isTapRootAddress
  );

  const liquidityQueryKey = bridgeKeys.btcQuote(
    params.toToken,
    params.toChain,
    (params as StakeParams)?.strategyAddress,
    'liquidity-check'
  );

  const liquidityQueryResult = useQuery({
    enabled: liquidityQueryEnabled,
    queryKey: liquidityQueryKey,
    refetchInterval: INTERVAL.MINUTE,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<UseLiquidityDataReturnType | undefined> => {
      const { toChain, toToken } = params;

      if (!toChain || !toToken) return;

      const quote = await gatewaySDK.getQuote({
        ...DEFAULT_GATEWAY_QUOTE_PARAMS,
        toChain,
        toToken,
        strategyAddress: params.type === GatewayTransactionType.STAKE ? params.strategyAddress : undefined,
        amount: undefined
      });

      const liquidityAmount = CurrencyAmount.fromRawAmount(BITCOIN, quote.satoshis);

      return { liquidityAmount, hasLiquidity: liquidityAmount.greaterThan(minAmount) };
    }
  });

  const estimateFeeErrorMessage = t(i18n)`Failed to get estimated fee`;

  const feeRatesQueryResult = useSatsFeeRate({
    query: {
      select: feeRatesSelect,
      meta: {
        onError() {
          toast.error(estimateFeeErrorMessage);
        }
      }
    }
  });

  const feeRate =
    selectedFee.speed === 'custom' ? selectedFee.networkRate : feeRatesQueryResult.data?.[selectedFee.speed];

  const feeEstimateQueryResult = useSatsFeeEstimate({
    opReturnData: evmAddress,
    feeRate: feeRate,
    query: {
      enabled: Boolean(satsBalance && satsBalance.total > 0n && evmAddress),
      select: (data) => CurrencyAmount.fromRawAmount(BITCOIN, data.amount),
      meta: {
        onError() {
          toast.error(estimateFeeErrorMessage);
        }
      }
    }
  });

  const balance = useMemo(
    () => getBalanceAmount(satsBalance?.total, feeEstimateQueryResult.data, liquidityQueryResult.data?.liquidityAmount),
    [liquidityQueryResult.data?.liquidityAmount, satsBalance?.total, feeEstimateQueryResult.data]
  );

  const isValidAmount = useCallback(() => {
    if (isNaN(+rawAmount)) return false;

    const amount = CurrencyAmount.fromBaseAmount(BITCOIN, rawAmount);

    return (
      (amount.equalTo(minAmount) || amount.greaterThan(minAmount)) &&
      (amount.equalTo(balance) || amount.lessThan(balance))
    );
  }, [rawAmount, minAmount, balance]);

  const quoteEnabled = Boolean(
    !isTapRootAddress &&
      btcAddress &&
      evmAddress &&
      liquidityQueryResult.data?.hasLiquidity &&
      rawAmount &&
      isValidAmount()
  );

  const quoteQueryKey = bridgeKeys.btcQuote(
    params.toToken,
    params.toChain,
    (params as StakeParams)?.strategyAddress,
    rawAmount,
    isTopUpEnabled
  );

  const quoteQueryResult = useQuery({
    enabled: quoteEnabled,
    queryKey: quoteQueryKey,
    refetchInterval: INTERVAL.SECONDS_30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const { toChain, toToken } = params;

      if (!rawAmount || !toChain || !toToken) return;

      const amount = CurrencyAmount.fromBaseAmount(BITCOIN, rawAmount);

      const quote = await gatewaySDK.getQuote({
        ...DEFAULT_GATEWAY_QUOTE_PARAMS,
        amount: amount.numerator.toString(),
        gasRefill: isTopUpEnabled ? GAS_REFILL : 0,
        toChain,
        toToken,
        strategyAddress: params.type === GatewayTransactionType.STAKE ? params.strategyAddress : undefined
      });

      return {
        amount,
        quote
      };
    },
    select: (data): UseQuoteDataReturnType | undefined => {
      if (!data) return;

      const protocolFeeAmount = CurrencyAmount.fromRawAmount(BITCOIN, data.quote.fee);

      const quoteAmount = data.amount.subtract(protocolFeeAmount);

      return {
        amount: quoteAmount,
        protocolFee: protocolFeeAmount,
        data: data.quote
      };
    }
  });

  const mutation = useMutation({
    mutationKey: bridgeKeys.btcDeposit(evmAddress, btcAddress),
    mutationFn: async ({ evmAddress }: { evmAddress: Address | string }): Promise<InitGatewayTransaction> => {
      if (!satsConnector) {
        throw new Error('Connector missing');
      }

      if (!quoteQueryResult.data) {
        throw new Error('Quote Data missing');
      }

      if (!feeEstimateQueryResult.data) {
        throw new Error('Fee estimate missing');
      }

      if (!params.toChain) {
        throw new Error('Something went wrong');
      }

      if (!isAddress(evmAddress)) {
        throw new Error('Invalid EVM address');
      }

      const { data: quoteData, amount: quoteAmount, protocolFee } = quoteQueryResult.data;

      const data: InitGatewayTransaction = {
        type: TransactionType.Gateway,
        fee: protocolFee.add(feeEstimateQueryResult.data),
        ...(params.type === GatewayTransactionType.BRIDGE
          ? { amount: params.token ? CurrencyAmount.fromBaseAmount(params.token, quoteAmount.toExact()) : undefined }
          : { assetName: params.assetName })
      };

      onMutate?.(data);

      const { uuid, psbtBase64 } = await gatewaySDK.startOrder(quoteData, {
        ...DEFAULT_GATEWAY_QUOTE_PARAMS,
        toChain: params.toChain,
        toUserAddress: evmAddress,
        fromUserAddress: satsConnector.paymentAddress!,
        fromUserPublicKey: satsConnector.publicKey,
        gasRefill: isTopUpEnabled ? GAS_REFILL : 0,
        feeRate
      });

      const bitcoinTxHex = await satsConnector.signAllInputs(psbtBase64!);

      // NOTE: user does not broadcast the tx, that is done by
      // the relayer after it is validated
      const txId = await gatewaySDK.finalizeOrder(uuid, bitcoinTxHex);

      return { ...data, txId };
    },
    onSuccess: (data) => {
      onSuccess?.(data);

      liquidityQueryResult.refetch();

      queryClient.removeQueries({ queryKey: quoteQueryKey });
    },
    onError: (error) => {
      toast.error(error.message);
      onError?.();

      Sentry.captureException(error);
    }
  });

  const hasError = !!(
    feeEstimateQueryResult.error ||
    feeRatesQueryResult.error ||
    liquidityQueryResult.error ||
    quoteQueryResult.error
  );

  const isPreparing =
    feeEstimateQueryResult.isPending && feeRatesQueryResult.isPending && liquidityQueryResult.isPending;

  const isReady = !hasError && !isPreparing;

  const isDisabled = isTapRootAddress || !liquidityQueryResult.data?.hasLiquidity || hasError;

  return {
    amount: rawAmount,
    setAmount,
    isTapRootAddress,
    isReady,
    isDisabled,
    query: {
      fee: {
        rates: feeRatesQueryResult,
        estimate: feeEstimateQueryResult
      },
      liquidity: liquidityQueryResult,
      quote: quoteQueryResult,
      minAmount,
      balance
    },
    type: params.type,
    mutation,
    settings: {
      topUp: {
        isEnabled: isTopUpEnabled,
        enable: setTopUpEnabled
      },
      fee: {
        rate: feeRate,
        setFee: setSelectedFee,
        selected: selectedFee
      }
    }
  };
};

export { useGateway };
export type { UseGatewayQueryDataReturnType, UseGatewayReturnType };
