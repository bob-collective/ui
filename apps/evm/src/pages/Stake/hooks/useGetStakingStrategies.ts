import { useCallback } from 'react';
import { GatewayStrategyContract } from '@gobob/bob-sdk';
import { ChainId } from '@gobob/chains';
import { ERC20Token, Ether, Token } from '@gobob/currency';

import { FeatureFlags, useFeatureFlag, useGetStrategies } from '../../../hooks';

type StrategyData = {
  raw: GatewayStrategyContract;
  currency?: Ether | ERC20Token;
};

const useGetStakingStrategies = () => {
  const isBtcGatewayEnabled = useFeatureFlag(FeatureFlags.BTC_GATEWAY);
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
    enabled: isBtcGatewayEnabled,
    select: selectStrategyData
  });
};

export { useGetStakingStrategies };
export type { StrategyData };
