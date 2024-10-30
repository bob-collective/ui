import { ChainId } from '@gobob/chains';
import { INTERVAL, useQuery } from '@gobob/react-query';
import { ERC20Token, Ether } from '@gobob/currency';
import { NATIVE } from '@gobob/tokens';

import { RawToken, tokens } from '../constants/assets';

type TokenData = {
  raw: RawToken;
  currency: Ether | ERC20Token;
};

const useTokens = (chainId: ChainId) => {
  return useQuery<TokenData[]>({
    queryKey: ['tokens', chainId],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: INTERVAL.HOUR,
    queryFn: async () =>
      tokens
        .filter((token) => token.chainId === chainId)
        .map((token) => ({
          raw: token,
          currency:
            token.symbol === NATIVE[chainId].symbol
              ? Ether.onChain(chainId)
              : new ERC20Token(chainId, token.address, token.decimals, token.symbol, token.name)
        }))
  });
};

export { useTokens };
export type { TokenData };
