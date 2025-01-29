'use client';

import { EsploraClient } from '@gobob/bob-sdk';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { useBtcAccount } from './useAccount';

import { bitcoinNetwork, INTERVAL } from '@/constants';

type GetBtcBalanceReturnType = { confirmed: bigint; unconfirmed: bigint; total: bigint };

type UseBtcBalanceProps = Omit<
  UseQueryOptions<GetBtcBalanceReturnType, unknown, GetBtcBalanceReturnType, (string | undefined)[]>,
  'initialData' | 'queryFn' | 'queryKey' | 'enabled'
>;

const useBtcBalance = (props: UseBtcBalanceProps = {}) => {
  const { address } = useBtcAccount();

  return useQuery({
    enabled: Boolean(address),
    queryKey: ['sats-balance', bitcoinNetwork, address],
    refetchInterval: INTERVAL.SECONDS_30,
    queryFn: async () => {
      if (!address) {
        return { confirmed: BigInt(0), unconfirmed: BigInt(0), total: BigInt(0) };
      }

      const esploraClient = new EsploraClient(bitcoinNetwork);

      const { confirmed, unconfirmed, total } = await esploraClient.getBalance(address);

      return { confirmed: BigInt(confirmed), unconfirmed: BigInt(unconfirmed), total: BigInt(total) };
    },
    ...props
  });
};

export { useBtcBalance };
