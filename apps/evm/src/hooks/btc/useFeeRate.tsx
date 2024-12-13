'use client';

import { EsploraClient, EsploraFeeEstimates, MempoolClient, MempoolRecomendedFee } from '@gobob/bob-sdk';
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { bitcoinNetwork, INTERVAL } from '@/constants';

type BtcFeeRateReturnType = {
  memPool: Record<keyof MempoolRecomendedFee, number>;
  esplora: Record<keyof EsploraFeeEstimates, number>;
};

type UseBtcFeeRateProps<TData = BtcFeeRateReturnType> = {
  rate?: keyof BtcFeeRateReturnType;
  query?: Omit<
    UndefinedInitialDataOptions<BtcFeeRateReturnType, Error, TData, (string | number)[]>,
    'queryKey' | 'queryFn'
  >;
};

function useBtcFeeRate<TData = BtcFeeRateReturnType>({ query }: UseBtcFeeRateProps<TData> = {}) {
  return useQuery({
    queryKey: ['sats-fee-rate', bitcoinNetwork],
    queryFn: async () => {
      const memPoolClient = new MempoolClient(bitcoinNetwork);
      const esploraClient = new EsploraClient(bitcoinNetwork);

      const [memPoolFeeRate, esploraFeeRate] = await Promise.all([
        memPoolClient.getRecommendedFees(),
        esploraClient.getFeeEstimates()
      ]);

      return {
        memPool: memPoolFeeRate,
        esplora: esploraFeeRate
      };
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: INTERVAL.MINUTE,
    ...query
  });
}

export { useBtcFeeRate };
export type { BtcFeeRateReturnType };
