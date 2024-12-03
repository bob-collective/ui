import { ChainId } from '@gobob/chains';
import { ERC20Token, Ether } from '@gobob/currency';
import { useQuery } from '@tanstack/react-query';

import { useTokens } from './useTokens';

import { INTERVAL, RawToken } from '@/constants';

type BridgeToken = {
  l1Token: RawToken;
  l2Token: RawToken;
  l1Currency: Ether | ERC20Token;
  l2Currency: Ether | ERC20Token;
};

const useBridgeTokens = (l1ChainId: ChainId, l2ChainId: ChainId) => {
  const { data: l1Tokens } = useTokens(l1ChainId);
  const { data: l2Tokens } = useTokens(l2ChainId);

  return useQuery<BridgeToken[]>({
    queryKey: ['token-list', l1ChainId, l2ChainId],
    enabled: Boolean(l1Tokens && l2Tokens),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: INTERVAL.HOUR,
    queryFn: async () => {
      return l1Tokens!.reduce<BridgeToken[]>((list, l1Token) => {
        const l2Token = l2Tokens!.find((l2Token) => l1Token.currency.symbol === l2Token.currency.symbol);

        if (!l2Token) return list;

        const token: BridgeToken = {
          l1Token: l1Token.raw,
          l2Token: l2Token.raw,
          l1Currency: l1Token.currency,
          l2Currency: l2Token.currency
        };

        return [...list, token];
      }, []);
    }
  });
};

export { useBridgeTokens };
export type { BridgeToken };
