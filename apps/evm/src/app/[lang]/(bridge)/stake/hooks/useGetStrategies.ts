import { GatewayStrategyContract } from '@gobob/bob-sdk';
import { ChainId } from '@gobob/chains';
import { ERC20Token, Token } from '@gobob/currency';
import { useCallback, useMemo } from 'react';

import { strategiesInfo, StrategyInfo } from '../constants';

import { StrategyDepositData, useStrategiesContractData } from './useStrategiesContractData';

import { useGetStrategies as useGetSdkStrategies } from '@/hooks';

type StrategyData = {
  meta: GatewayStrategyContract['integration'];
  contract: GatewayStrategyContract;
  info: StrategyInfo;
  currency?: ERC20Token;
  tvl?: number;
  deposit?: StrategyDepositData;
};

const useGetStrategies = () => {
  const selectStrategyData = useCallback(
    (strategies: GatewayStrategyContract[]) =>
      strategies
        .map((strategy) => {
          const info = strategiesInfo[strategy.integration.slug];

          if (!info) return undefined;

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

  const {
    data: strategies,
    isSuccess: isStrategiesSucess,
    isPending: isStrategiesPending
  } = useGetSdkStrategies({
    select: selectStrategyData
  });

  const { data: strategiesContractData, isPending: isStatsPending } = useStrategiesContractData(strategies, {
    enabled: isStrategiesSucess
  });

  const strategiesData: StrategyData[] | undefined = useMemo(
    () =>
      strategies?.map((strategy) => ({
        ...strategy,
        tvl: strategiesContractData?.[strategy.contract.id]?.tvl,
        deposit: strategiesContractData?.[strategy.contract.id]?.deposit
      })),
    [strategies, strategiesContractData]
  );

  return { data: strategiesData, isPending: isStrategiesPending || isStatsPending };
};

export { useGetStrategies };
export type { StrategyData };
