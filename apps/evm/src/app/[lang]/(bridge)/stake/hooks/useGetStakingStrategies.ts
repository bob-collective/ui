import { GatewayStrategyContract } from '@gobob/bob-sdk';
import { ChainId } from '@gobob/chains';
import { ERC20Token, Token } from '@gobob/currency';
import { useCallback, useMemo } from 'react';

import { useGetStrategies } from '@/hooks';
import { useStrategiesContractData } from './useStrategiesContractData';

type StrategyData = {
  tvl?: number | null;
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

  const { data: strategies, isSuccess: isStrategiesSucess } = useGetStrategies({
    select: selectStrategyData
  });

  const { data: strategiesContractData } = useStrategiesContractData(strategies, { enabled: isStrategiesSucess });

  const strategiesData = useMemo(
    () =>
      strategies?.map((strategy) => {
        const tvl = strategiesContractData?.[strategy.raw.id]?.tvl;

        if (tvl) {
          return {
            ...strategy,
            tvl
          };
        }

        return {
          ...strategy,
          tvl: null
        };
      }),
    [strategiesContractData]
  );

  return { data: strategiesData };
};

export { useGetStakingStrategies };
export type { StrategyData };
