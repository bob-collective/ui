import { GatewayStrategyContract } from '@gobob/bob-sdk';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { Address } from 'viem';
import { ChainId } from '@gobob/chains';
import { CurrencyTicker } from '@gobob/hooks';

import { INTERVAL } from '@/constants';
import { bridgeKeys } from '@/lib/react-query';

type Token = {
  chainId: ChainId;
  address: Address;
  decimals: number;
  name: CurrencyTicker | string;
  symbol: CurrencyTicker | string;
  value: string;
};

type StrategyOnchainData = {
  tvl: number;
  deposit: {
    token: Token;
    usd: number;
  };
  withdraw: {
    token: Token;
    usd: number;
  };
};

const getStrategies = async (address: Address | undefined) => {
  const searchParams = new URLSearchParams([]);

  if (address) searchParams.append('address', address);

  const url = '/api/strategies?' + searchParams;

  const response = await fetch(url);

  return response.json();
};

const useGetStrategies = <T>(
  props: Omit<
    UseQueryOptions<(GatewayStrategyContract & StrategyOnchainData)[], unknown, T | undefined, string[]>,
    'queryKey' | 'queryFn' | 'refetchInterval'
  > = {}
) => {
  const { address } = useAccount();

  return useQuery({
    queryKey: bridgeKeys.strategies(address),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: INTERVAL.HOUR,
    queryFn: () => getStrategies(address),
    ...props
  });
};

export { useGetStrategies };
export type { StrategyOnchainData };
