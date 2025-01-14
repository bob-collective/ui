import { useCallback } from 'react';
import { CurrencyAmount, ERC20Token } from '@gobob/currency';
import { ChainId } from '@gobob/chains';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { Balances } from './useBalances';

import { blockscoutClient } from '@/utils';
import { BlockscoutTokenInfo } from '@/utils/blockscout-client';
import { INTERVAL } from '@/constants';

const useBlockscoutBalances = (chainId: ChainId) => {
  const { address } = useAccount();

  const blockscoutBalanceSelector = useCallback(
    (data: BlockscoutTokenInfo[]) => {
      return data.reduce<Balances>((result, tokenInfo) => {
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
      }, {} as Balances);
    },
    [chainId]
  );

  return useQuery({
    enabled: Boolean(address),
    queryKey: ['blockscout-balances', address!],
    queryFn: () => blockscoutClient.getTokens(address!, ['ERC-20']),
    select: blockscoutBalanceSelector,
    refetchInterval: INTERVAL.SECONDS_30
  });
};

export { useBlockscoutBalances };
