import { useCallback } from 'react';
import { ChainId } from '@gobob/chains';
import { ERC20Token, Ether } from '@gobob/currency';
import { NATIVE } from '@gobob/tokens';
import { useQuery } from '@tanstack/react-query';
import { Address } from 'viem';

import { useBlockscoutAddressTokens } from './useBlockscoutAddressTokens';

import { INTERVAL, RawToken, tokens } from '@/constants';
import { BlockscoutTokenInfo } from '@/utils';

type TokenData = {
  raw: RawToken;
  currency: Ether | ERC20Token;
};

const useTokens = (chainId: ChainId) => {
  const blockscoutTokensSelector = useCallback(
    (data: BlockscoutTokenInfo[]) => {
      return data.map((blockscoutToken) => ({
        raw: {
          ...blockscoutToken.token,
          decimals: Number(blockscoutToken.token.decimals),
          chainId,
          logoUrl: '',
          apiId: ''
        },
        currency: new ERC20Token(
          chainId,
          blockscoutToken.token.address,
          Number(blockscoutToken.token.decimals),
          blockscoutToken.token.symbol,
          blockscoutToken.token.name
        )
      }));
    },
    [chainId]
  );

  const { data: blockscoutAddressTokens } = useBlockscoutAddressTokens({
    select: blockscoutTokensSelector
  });

  return useQuery<TokenData[]>({
    queryKey: ['tokens', chainId, blockscoutAddressTokens],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: INTERVAL.HOUR,
    queryFn: async () => {
      const mapping = [
        ...(chainId === ChainId.BOB && blockscoutAddressTokens ? blockscoutAddressTokens : []),
        ...tokens
          .filter((token) => token.chainId === chainId)
          .map((token) => ({
            raw: token,
            currency:
              token.symbol === NATIVE[chainId].symbol
                ? Ether.onChain(chainId)
                : new ERC20Token(chainId, token.address, token.decimals, token.symbol, token.name)
          }))
      ].reduce(
        (acc, cur) => {
          acc[cur.raw.address] = cur;

          return acc;
        },
        {} as Record<Address, TokenData>
      );

      return Object.values(mapping);
    }
  });
};

export { useTokens };
export type { TokenData };
