import { ChainId } from '@gobob/chains';
import { CurrencyAmount, ERC20Token, Ether } from '@gobob/currency';
import { useCallback } from 'react';

import { useBlockscoutAddressTokens } from './useBlockscoutAddressTokens';

import { BlockscoutTokenInfo } from '@/utils';

type Balances = Record<string, CurrencyAmount<ERC20Token | Ether>>;

const useBlockscoutBalances = () => {
  const blockscoutBalanceSelector = useCallback((data: BlockscoutTokenInfo[]) => {
    return data.reduce<Balances>((result, tokenInfo) => {
      result[tokenInfo.token.symbol] = CurrencyAmount.fromRawAmount(
        new ERC20Token(
          ChainId.BOB,
          tokenInfo.token.address,
          Number.parseInt(tokenInfo.token.decimals),
          tokenInfo.token.symbol,
          tokenInfo.token.name
        ),
        tokenInfo.value
      );

      return result;
    }, {} as Balances);
  }, []);

  const result = useBlockscoutAddressTokens({
    select: blockscoutBalanceSelector
  });

  const getBlockscoutBalance = useCallback(
    (symbol: string) => {
      return result.data?.[symbol];
    },
    [result.data]
  );

  return {
    ...result,
    getBlockscoutBalance
  };
};

export { useBlockscoutBalances };
