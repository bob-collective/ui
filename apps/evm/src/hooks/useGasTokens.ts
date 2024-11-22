import { ChainId } from '@gobob/chains';
import { ERC20Token, Ether } from '@gobob/currency';
import { NATIVE } from '@gobob/tokens';
import { useQuery } from '@tanstack/react-query';

import { tokens } from '../constants/assets';

import { TokenData } from './useTokens';

import { INTERVAL } from '@/constants';

const useGasTokens = (chainId: ChainId) => {
  return useQuery<TokenData[]>({
    queryKey: ['gas-tokens', chainId],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: INTERVAL.HOUR,
    queryFn: async () =>
      tokens
        .filter((token) => token.chainId === chainId && token.symbol === NATIVE[chainId].symbol)
        .map((token) => ({
          raw: token,
          currency:
            token.symbol === NATIVE[chainId].symbol
              ? Ether.onChain(chainId)
              : new ERC20Token(chainId, token.address, token.decimals, token.symbol, token.name)
        }))
  });
};

export { useGasTokens };
