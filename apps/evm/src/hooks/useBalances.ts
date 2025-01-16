import { ChainId } from '@gobob/chains';
import { CurrencyAmount, ERC20Token, Ether } from '@gobob/currency';
import { chain } from '@react-aria/utils';
import { useCallback, useMemo } from 'react';
import { erc20Abi } from 'viem';
import { useAccount, useBalance, usePublicClient, useReadContracts } from 'wagmi';

import { useTokens } from './useTokens';
import { useBlockscoutAddressTokens } from './useBlockscoutAddressTokens';

import { INTERVAL } from '@/constants';
import { BlockscoutTokenInfo } from '@/utils';

type TokensMapping = Record<string, CurrencyAmount<ERC20Token | Ether>>;

const useBalances = (chainId: ChainId) => {
  const publicClient = usePublicClient({ chainId });
  const { address } = useAccount();

  const blockscoutBalanceSelector = useCallback(
    (data: BlockscoutTokenInfo[]) => {
      return data.reduce<TokensMapping>((result, tokenInfo) => {
        result[tokenInfo.token.symbol] = CurrencyAmount.fromRawAmount(
          new ERC20Token(
            chainId,
            tokenInfo.token.address,
            Number.parseInt(tokenInfo.token.decimals),
            tokenInfo.token.symbol,
            tokenInfo.token.name
          ),
          tokenInfo.value
        );

        return result;
      }, {} as TokensMapping);
    },
    [chainId]
  );

  const { data: blockscoutAddressTokens, refetch: refetchBlockscoutAddressTokens } = useBlockscoutAddressTokens({
    select: blockscoutBalanceSelector
  });

  const { data: ethBalance, refetch } = useBalance({
    address,
    chainId,
    query: {
      refetchInterval: INTERVAL.SECONDS_30
    }
  });

  const { data: tokens } = useTokens(chainId);

  const balanceSelector = useCallback(
    (data: (string | number | bigint)[]): TokensMapping => {
      if (!tokens) return {} as TokensMapping;

      return tokens.reduce<TokensMapping>((result, token) => {
        if (token.currency.isToken) {
          const idx = Object.keys(result).length;

          result[token.raw.symbol] = CurrencyAmount.fromRawAmount(token.currency, data[idx]!);
        }

        return result;
      }, {} as TokensMapping);
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
      ...blockscoutAddressTokens,
      ...erc20Balances,
      ...(ethBalance && {
        [ether.symbol]: CurrencyAmount.fromRawAmount(ether, ethBalance.value)
      })
    };
  }, [chainId, blockscoutAddressTokens, erc20Balances, ethBalance]);

  const getBalance = useCallback((symbol: string) => balances?.[symbol], [balances]);
  const refetchBalance = useCallback(
    () => chain(refetch, refetchErc20, refetchBlockscoutAddressTokens),
    [refetch, refetchErc20, refetchBlockscoutAddressTokens]
  );

  return { ...queryResult, balances, getBalance, refetch: refetchBalance };
};

export { useBalances };
