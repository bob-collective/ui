import { ChainId } from '@gobob/chains';
import { CurrencyAmount, ERC20Token, Ether } from '@gobob/currency';
import { chain } from '@react-aria/utils';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { erc20Abi } from 'viem';
import { useAccount, useBalance, usePublicClient } from 'wagmi';
import { watchContractEvent } from '@wagmi/core';

import { useTokens } from './useTokens';

import { INTERVAL, isProd } from '@/constants';
import { getConfig } from '@/lib/wagmi';

type Balances = Record<string, CurrencyAmount<ERC20Token | Ether>>;

const useBalances = (chainId: ChainId) => {
  const publicClient = usePublicClient({ chainId });
  const { address } = useAccount();

  const { data: ethBalance, refetch } = useBalance({ address, chainId });

  const { data: tokens } = useTokens(chainId);

  // TODO: useReadContracts instead https://wagmi.sh/react/guides/migrate-from-v1-to-v2#deprecated-usebalance-token-parameter
  const {
    data: erc20Balances,
    refetch: refetchErc20,
    ...queryResult
  } = useQuery({
    queryKey: ['balances', chainId, address],
    enabled: Boolean(address && publicClient && tokens),
    queryFn: async () => {
      if (!tokens || !publicClient) return;

      const erc20List = tokens.filter((token) => token.currency.isToken);

      const balancesMulticallResult = await publicClient.multicall({
        contracts: erc20List.map((token) => ({
          abi: erc20Abi,
          address: token.raw.address,
          functionName: 'balanceOf',
          args: [address]
        }))
      });

      return erc20List.reduce<Balances>(
        (result, token, index) => ({
          ...result,
          [token.raw.symbol]: CurrencyAmount.fromRawAmount(
            token.currency,
            (balancesMulticallResult[index]?.result as bigint) || 0n
          )
        }),
        {} as Balances
      );
    },
    refetchInterval: INTERVAL.MINUTE
  });

  const shouldRefetchRef = useRef(false);

  useEffect(() => {
    const unwatchers = tokens?.map((token) =>
      watchContractEvent(getConfig({ isProd }), {
        address: token.raw.address,
        abi: erc20Abi,
        eventName: 'Transfer',
        onLogs(logs) {
          shouldRefetchRef.current = logs.reduce(
            (acc, log) => acc || log.args.from === address || log.args.to === address,
            false
          );
        }
      })
    );

    const intervalId = setInterval(() => {
      if (shouldRefetchRef.current) {
        shouldRefetchRef.current = false;
        chain(refetch, refetchErc20);
      }
    }, 3000);

    return () => {
      if (shouldRefetchRef.current) {
        shouldRefetchRef.current = false;
        chain(refetch, refetchErc20);
      }
      clearInterval(intervalId);
      unwatchers?.forEach((unwatch) => unwatch());
    };
  }, [address, refetch, refetchErc20, tokens]);

  const balances = useMemo(() => {
    const ether = Ether.onChain(chainId);

    return {
      ...erc20Balances,
      ...(ethBalance && {
        [ether.symbol]: CurrencyAmount.fromRawAmount(ether, ethBalance.value)
      })
    };
  }, [erc20Balances, ethBalance, chainId]);

  const getBalance = useCallback((symbol: string) => balances?.[symbol], [balances]);

  return { ...queryResult, balances, getBalance, refetch: chain(refetch, refetchErc20) };
};

export { useBalances };
