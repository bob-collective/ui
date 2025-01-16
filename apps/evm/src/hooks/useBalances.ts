import { ChainId } from '@gobob/chains';
import { CurrencyAmount, ERC20Token, Ether } from '@gobob/currency';
import { chain } from '@react-aria/utils';
import { useCallback, useMemo } from 'react';
import { erc20Abi } from 'viem';
import { useAccount, useBalance, usePublicClient, useReadContracts } from 'wagmi';

import { useTokens } from './useTokens';
import { useBlockscoutBalances } from './useBlockscoutBalances';

import { INTERVAL } from '@/constants';

export type Balances = Record<string, CurrencyAmount<ERC20Token | Ether>>;

const useBalances = (chainId: ChainId) => {
  const publicClient = usePublicClient({ chainId });
  const { address } = useAccount();

  const { data: blockscoutBalances, refetch: refetchBlockscoutBalances } = useBlockscoutBalances(chainId);

  const { data: ethBalance, refetch } = useBalance({
    address,
    chainId,
    query: {
      refetchInterval: INTERVAL.SECONDS_30
    }
  });

  const { data: tokens } = useTokens(chainId);

  const balanceSelector = useCallback(
    (data: (string | number | bigint)[]): Balances => {
      if (!tokens) return {} as Balances;

      return tokens.reduce<Balances>((result, token) => {
        if (token.currency.isToken) {
          const idx = Object.keys(result).length;

          result[token.raw.symbol] = CurrencyAmount.fromRawAmount(token.currency, data[idx]!);
        }

        return result;
      }, {} as Balances);
    },
    [tokens]
  );

  const {
    data: erc20Balances,
    refetch: refetchErc20,
    ...queryResult
  } = useReadContracts({
    allowFailure: false,
    query: {
      enabled: Boolean(address && publicClient && tokens),
      select: balanceSelector,
      refetchInterval: INTERVAL.SECONDS_30
    },
    contracts: tokens
      ?.filter((token) => token.currency.isToken)
      .map((token) => ({
        abi: erc20Abi,
        address: token.raw.address,
        functionName: 'balanceOf',
        args: [address],
        chainId
      }))
  });

  const balances = useMemo(() => {
    const ether = Ether.onChain(chainId);

    return {
      ...blockscoutBalances,
      ...erc20Balances,
      ...(ethBalance && {
        [ether.symbol]: CurrencyAmount.fromRawAmount(ether, ethBalance.value)
      })
    };
  }, [chainId, blockscoutBalances, erc20Balances, ethBalance]);

  const getBalance = useCallback((symbol: string) => balances?.[symbol], [balances]);
  const refetchBalance = useCallback(
    () => chain(refetch, refetchErc20, refetchBlockscoutBalances),
    [refetch, refetchErc20, refetchBlockscoutBalances]
  );

  return { ...queryResult, balances, getBalance, refetch: refetchBalance };
};

export { useBalances };
