'use client';

import { estimateTxFee } from '@gobob/bob-sdk';

import { useBtcAccount } from './useAccount';
import { useBtcFeeRate } from './useFeeRate';

import { bitcoinNetwork, INTERVAL } from '@/constants';
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

type UseBtcFeeEstimateReturnType = { amount: bigint; feeRate: number };

type UseBtcFeeEstimateProps<TData = UseBtcFeeEstimateReturnType> = {
  query?: Omit<
    UndefinedInitialDataOptions<UseBtcFeeEstimateReturnType, Error, TData, (string | number | undefined)[]>,
    'queryKey' | 'queryFn'
  >;
  amount?: number;
  opReturnData?: string;
  confirmationTarget?: number;
  feeRate?: number;
};

function useBtcFeeEstimate<TData = UseBtcFeeEstimateReturnType>({
  amount,
  opReturnData,
  feeRate: feeRateProp,
  query
}: UseBtcFeeEstimateProps<TData> = {}) {
  const { address, publicKey } = useBtcAccount();
  const { data: feeRateData } = useBtcFeeRate();

  const enabled = Boolean(feeRateData && address && (query?.enabled !== undefined ? query.enabled : true));

  const feeRate = feeRateProp || feeRateData?.esplora[6];

  return useQuery({
    queryKey: ['sats-fee-estimate', amount, address, opReturnData, bitcoinNetwork, feeRate],
    queryFn: async () => {
      if (!address || !feeRate) {
        throw new Error('Failed to estimate fee');
      }

      return { feeRate, amount: await estimateTxFee(address, amount, publicKey, opReturnData, feeRate) };
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: INTERVAL.MINUTE,
    ...query,
    enabled
  });
}

export { useBtcFeeEstimate };
