import { GatewayStrategyContract } from '@gobob/bob-sdk';
import { ERC20Token, Ether, Token } from '@gobob/currency';
import { ChainId } from '@gobob/chains';

import { FeatureFlags, useFeatureFlag, useGetStrategies } from '../../../hooks';

type StrategyData = {
  raw: GatewayStrategyContract;
  currency?: Ether | ERC20Token;
};

const useGetStakingStrategies = () => {
  const isBtcGatewayEnabled = useFeatureFlag(FeatureFlags.BTC_GATEWAY);

  return useGetStrategies({
    enabled: isBtcGatewayEnabled,
    select(strategies) {
      return strategies
        .filter((strategy) => strategy.integration.type === 'staking')
        .map<StrategyData>((strategy) => {
          return {
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
          };
        });
    }
  });
};

export { useGetStakingStrategies };
export type { StrategyData };
