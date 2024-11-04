import { GatewayStrategyContract } from '@gobob/bob-sdk';
import { ChainId } from '@gobob/chains';
import { ERC20Token, Token } from '@gobob/currency';
import { useCallback } from 'react';

import { useGetStrategies } from '@/hooks';

type StrategyData = {
  raw: GatewayStrategyContract;
  currency?: ERC20Token;
};

const useGetStakingStrategies = () => {
  const selectStrategyData = useCallback(
    (strategies: GatewayStrategyContract[]) =>
      strategies.map<StrategyData>((strategy) => ({
        raw: strategy,
        currency: strategy.outputToken
          ? new Token(
              ChainId.BOB,
              strategy.outputToken.address as `0x${string}`,
              strategy.outputToken.decimals,
              strategy.outputToken.symbol,
              strategy.outputToken.symbol
            )
          : undefined
      })),
    []
  );

  return useGetStrategies({
    select: selectStrategyData
  });
};

export { useGetStakingStrategies };
export type { StrategyData };
