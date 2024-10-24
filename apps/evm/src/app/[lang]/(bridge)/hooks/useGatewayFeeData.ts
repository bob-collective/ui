'use client';

import { CurrencyAmount } from '@gobob/currency';
import {
  useBalance as useSatsBalance,
  useFeeEstimate as useSatsFeeEstimate,
  useFeeRate as useSatsFeeRate
} from '@gobob/sats-wagmi';
import { BITCOIN } from '@gobob/tokens';
import { toast } from '@gobob/ui';
import { useAccount } from '@gobob/wagmi';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useEffect, useMemo, useState } from 'react';

import { GatewayTransactionFee, GatewayTransactionSpeed, GatewayTransactionSpeedData } from '@/types';

const useGatewayFeeData = () => {
  const { i18n } = useLingui();

  const { address: evmAddress } = useAccount();

  const { data: satsBalance } = useSatsBalance();

  const hasBalance = satsBalance && satsBalance.confirmed > 0n;

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

  const [selectedFee, setSelectedFee] = useState<GatewayTransactionFee>({ speed: GatewayTransactionSpeed.SLOW });

  const feeRate = selectedFee.speed === 'custom' ? selectedFee.networkRate : feeRateData?.[selectedFee.speed];

  const {
    data: satsFeeEstimate,
    isLoading: isSatsFeeEstimateLoading,
    error: satsFeeEstimateError
  } = useSatsFeeEstimate({
    opReturnData: evmAddress,
    feeRate: feeRate,
    query: {
      enabled: hasBalance && !!evmAddress
    }
  });

  const feeAmount = useMemo(
    () => satsFeeEstimate && CurrencyAmount.fromRawAmount(BITCOIN, satsFeeEstimate.amount),
    [satsFeeEstimate]
  );

  const error = satsFeeEstimateError || satsFeeRateError;

  useEffect(() => {
    if (error) {
      toast.error(t(i18n)`Failed to get estimated fee`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return {
    error,
    feeRateData,
    feeRate,
    feeAmount,
    selectedFee,
    setSelectedFee: setSelectedFee,
    isLoading: isSatsFeeEstimateLoading || isSatsFeeRateLoading
  };
};

export { useGatewayFeeData };
