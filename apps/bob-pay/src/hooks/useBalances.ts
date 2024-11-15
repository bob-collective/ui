import { ChainId } from '@gobob/chains';
import { CurrencyAmount, ERC20Token, Ether } from '@gobob/currency';
import { DefinedInitialDataOptions, INTERVAL, useQuery } from '@gobob/react-query';
import { useCallback, useMemo } from 'react';
import { Address, erc20Abi } from 'viem';
import { usePublicClient } from 'wagmi';

import { useDynamicAddress } from './useDynamicAddress';
import { useTokens } from './useTokens';

type Balances = Record<Address, CurrencyAmount<ERC20Token | Ether>>;

const useBalances = (chainId: ChainId, query?: Pick<DefinedInitialDataOptions, 'meta'>) => {
  const publicClient = usePublicClient({ chainId });
  const address = useDynamicAddress();

  const { data: tokens } = useTokens(chainId);

  const erc20Tokens = useMemo(() => tokens.filter((token) => token.currency.isToken), [tokens]);
  const native = useMemo(() => tokens.find((token) => token.currency.isNative), [tokens]);

  const { data: balances, ...queryResult } = useQuery({
    ...query,
    queryKey: ['balances', chainId, address],
    enabled: Boolean(address && publicClient && tokens),
    queryFn: async () => {
      if (!tokens || !publicClient) return;

      const [erc20TokensBalance, nativeBalance] = await Promise.all([
        publicClient.multicall({
          contracts: erc20Tokens.map((token) => ({
            abi: erc20Abi,
            address: token.raw.address,
            functionName: 'balanceOf',
            args: [address]
          }))
        }),
        native ? publicClient.getBalance({ address }) : undefined
      ]);

      return {
        erc20TokensBalance,
        nativeBalance
      };
    },
    refetchInterval: INTERVAL.MINUTE,
    select: (data) => {
      const { erc20TokensBalance, nativeBalance } = data || {};

      return erc20Tokens.reduce<Balances>(
        (result, token, index) => ({
          ...result,
          [token.raw.address]: CurrencyAmount.fromRawAmount(
            token.currency,
            (erc20TokensBalance?.[index]?.result as bigint) || 0n
          )
        }),
        native && nativeBalance
          ? { [native?.raw.address]: CurrencyAmount.fromRawAmount(native.currency, nativeBalance) }
          : ({} as Balances)
      );
    }
  });

  const getBalance = useCallback((address: Address) => balances?.[address], [balances]);

  return { ...queryResult, balances, getBalance };
};

export { useBalances };
