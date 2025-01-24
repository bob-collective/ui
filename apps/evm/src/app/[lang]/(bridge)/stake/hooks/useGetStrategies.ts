import { GatewayStrategyContract } from '@gobob/bob-sdk';
import { ChainId } from '@gobob/chains';
import { ERC20Token, Token } from '@gobob/currency';
import { useCallback } from 'react';

import { strategiesInfo, StrategyInfo } from '../constants';

import { StrategyOnchainData, useGetStrategies as useGetSdkStrategies } from '@/hooks';

type StrategyData = {
  meta: GatewayStrategyContract['integration'];
  contract: GatewayStrategyContract & StrategyOnchainData;
  info: StrategyInfo;
  currency?: ERC20Token;
};

const useGetStrategies = () => {
  const selectStrategyData = useCallback(
    (strategies: GatewayStrategyContract[]) =>
      strategies
        .map((strategy) => {
          const info = strategiesInfo[strategy.integration.slug];

          if (!info || info.isHidden) return undefined;

          return {
            meta: strategy.integration,
            contract: strategy,
            info: info,
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
        })
        .filter(Boolean) as StrategyData[],
    []
  );

  return useGetSdkStrategies({
    select: selectStrategyData
  });
};

export { useGetStrategies };
export type { StrategyData };
