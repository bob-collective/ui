import { ChainId } from '@gobob/chains';
import { CurrencyAmount, ERC20Token, Ether } from '@gobob/currency';
import { useCallback } from 'react';

import { useBlockscoutAddressTokens } from './useBlockscoutAddressTokens';

import { BlockscoutTokenInfo } from '@/utils';

type TokensMapping = Record<string, CurrencyAmount<ERC20Token | Ether>>;

const useBlockscoutBalances = () => {
  const blockscoutBalanceSelector = useCallback((data: BlockscoutTokenInfo[]) => {
    return data.reduce<TokensMapping>((result, tokenInfo) => {
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
    }, {} as TokensMapping);
  }, []);

  return useBlockscoutAddressTokens({
    select: blockscoutBalanceSelector
  });
};

export { useBlockscoutBalances };
