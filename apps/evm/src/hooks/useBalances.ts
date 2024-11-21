import { ChainId } from '@gobob/chains';
import { CurrencyAmount, ERC20Token, Ether } from '@gobob/currency';
import { INTERVAL, useQuery } from '@gobob/react-query';
import { useAccount, useBalance, usePublicClient } from '@gobob/wagmi';
import { chain } from '@react-aria/utils';
import { useCallback, useMemo } from 'react';
import { erc20Abi } from 'viem';

import { useTokens } from './useTokens';

type Balances = Record<string, CurrencyAmount<ERC20Token | Ether>>;

const useBalances = (chainId: ChainId) => {
  const publicClient = usePublicClient({ chainId });
  const { address } = useAccount();

  const { data: ethBalance, refetch } = useBalance({ address, chainId });

  const { data: tokens } = useTokens(chainId);

  // TODO: add transfer event listener and update balance on transfer in/out
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
