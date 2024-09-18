import { INTERVAL, useQuery } from '@gobob/react-query';
import { GatewayStrategyContract } from '@gobob/bob-sdk';
import { ChainId } from '@gobob/chains';
import { ERC20Token, Ether, Token } from '@gobob/currency';

import { gatewaySDK } from '../lib/bob-sdk';
import { bridgeKeys } from '../lib/react-query';

import { FeatureFlags, useFeatureFlag } from './useFeatureFlag';

type StrategyData = {
  raw: GatewayStrategyContract;
  currency?: Ether | ERC20Token;
};

const useGetStakeStrategies = () => {
  const isBtcGatewayEnabled = useFeatureFlag(FeatureFlags.BTC_GATEWAY);

  return useQuery({
    enabled: isBtcGatewayEnabled,
    queryKey: bridgeKeys.strategies(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: INTERVAL.HOUR,
    queryFn: async () => {
      return await gatewaySDK.getStrategies();
    },
    select: (strategies) =>
      strategies.map<StrategyData>((strategy) => {
        const token = strategy.outputToken;

        return {
          raw: strategy,
          currency: token
            ? new Token(ChainId.BOB, token.address as `0x${string}`, token.decimals, token.symbol, token.symbol)
            : undefined
        };
      })
  });
};

export { useGetStakeStrategies };
export type { StrategyData };
