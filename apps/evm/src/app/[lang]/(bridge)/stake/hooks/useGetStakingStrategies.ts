import { GatewayStrategyContract } from '@gobob/bob-sdk';
import { ChainId } from '@gobob/chains';
import { ERC20Token, Token } from '@gobob/currency';
import { useCallback, useMemo } from 'react';

import { strategiesInfo, StrategyInfo } from '../constants';

import { useStrategiesContractData } from './useStrategiesContractData';

import { useGetStrategies } from '@/hooks';

type StrategyData = {
  tvl?: number | null;
  data: {
    contract: GatewayStrategyContract;
    info: StrategyInfo;
  };
  currency?: ERC20Token;
};

const useGetStakingStrategies = () => {
  const selectStrategyData = useCallback(
    (strategies: GatewayStrategyContract[]) =>
      strategies
        .map((strategy) => {
          const info = strategiesInfo[strategy.integration.slug];

          if (!info) return undefined;

          return {
            data: {
              contract: strategy,
              info: info
            },
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

  const {
    data: strategies,
    isSuccess: isStrategiesSucess,
    isPending: isStrategiesPending
  } = useGetStrategies({
    select: selectStrategyData
  });

  const { data: strategiesContractData, isPending: isStatsPending } = useStrategiesContractData(strategies, {
    enabled: isStrategiesSucess
  });

  const strategiesData = useMemo(
    () =>
      strategies?.map((strategy) => {
        const tvl = strategiesContractData?.[strategy.data.contract.id]?.tvl;
        const userStaked = strategiesContractData?.[strategy.data.contract.id]?.userStaked;

        return {
          ...strategy,
          tvl,
          userStaked
        };
      }),
    [strategies, strategiesContractData]
  );

  return { data: strategiesData, isPending: isStrategiesPending || isStatsPending };
};

export { useGetStakingStrategies };
export type { StrategyData };
