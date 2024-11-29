import { GatewayStrategyContract } from '@gobob/bob-sdk';
import { ChainId } from '@gobob/chains';
import { ERC20Token, Token } from '@gobob/currency';
import { useCallback, useMemo } from 'react';
import { ResolvedRegister, useReadContracts } from 'wagmi';
import { CurrencyTickers, usePrices } from '@gobob/hooks';
import { Address, erc20Abi } from 'viem';

import { useGetStrategies } from '@/hooks';
import { seTokenAbi } from '@/abis/seToken.abi';

type StrategyData = {
  raw: GatewayStrategyContract;
  currency?: ERC20Token;
};

const seTokensToUnderlyingMapping: Record<string, CurrencyTickers> = {
  seSOLVBTCBBN: CurrencyTickers['SolvBTC.BBN'],
  seUNIBTC: CurrencyTickers.UNIBTC,
  seTBTC: CurrencyTickers.TBTC,
  seWBTC: CurrencyTickers.WBTC
};

function hasUnderlyingToken(symbol: string | undefined): symbol is keyof typeof seTokensToUnderlyingMapping {
  if (typeof symbol === 'undefined') return false;

  return Boolean(seTokensToUnderlyingMapping[symbol]);
}

const tokenToIdMapping: Record<string, CurrencyTickers> = {
  uniBTC: CurrencyTickers.UNIBTC,
  'SolvBTC.BBN': CurrencyTickers['SolvBTC.BBN']
};

function hasCGId(symbol: string | undefined): symbol is keyof typeof tokenToIdMapping {
  if (typeof symbol === 'undefined') return false;

  return Boolean(tokenToIdMapping[symbol]);
}

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

  const {
    data: strategies,
    isLoading: isStrategiesLoading,
    ...rest
  } = useGetStrategies({
    select: selectStrategyData
  });

  // se tokens contract data
  const { data: seTokensContractData } = useReadContracts<unknown[], boolean, ResolvedRegister['config'], bigint[]>({
    query: {
      enabled: !isStrategiesLoading
    },
    allowFailure: false,
    contracts: strategies?.flatMap((strategy) =>
      hasUnderlyingToken(strategy.raw.outputToken?.symbol)
        ? [
            {
              address: strategy.raw.outputToken.address as Address,
              abi: seTokenAbi,
              functionName: 'exchangeRateStored'
            },
            {
              address: strategy.raw.outputToken.address as Address,
              abi: seTokenAbi,
              functionName: 'totalSupply'
            }
          ]
        : []
    )
  });

  const seTokenContractDataCalls = useMemo(() => {
    if (!strategies) return null;

    return strategies.reduce(
      (acc, strategy) => {
        if (hasUnderlyingToken(strategy.raw.outputToken?.symbol) && seTokensContractData) {
          const idx = Object.keys(acc).length * 2;

          // for each se* token we need tulpes of 2 call results
          acc[strategy.raw.outputToken?.symbol] = seTokensContractData.slice(idx, idx + 2) as [bigint, bigint];
        }

        return acc;
      },
      {} as Record<keyof typeof seTokensToUnderlyingMapping, [bigint, bigint]>
    );
  }, [seTokensContractData, strategies]);

  // erc20 tokens contract data
  const { data: tokensContractData } = useReadContracts<unknown[], boolean, ResolvedRegister['config'], bigint[]>({
    query: {
      enabled: !isStrategiesLoading
    },
    allowFailure: false,
    contracts: strategies?.flatMap((strategy) =>
      hasCGId(strategy.raw.outputToken?.symbol)
        ? [
            {
              address: strategy.raw.outputToken.address as Address,
              abi: erc20Abi,
              functionName: 'totalSupply'
            }
          ]
        : []
    )
  });

  const tokensContractDataCalls = useMemo(() => {
    if (!strategies) return null;

    return strategies.reduce(
      (acc, strategy) => {
        if (hasCGId(strategy.raw.outputToken?.symbol) && tokensContractData) {
          const idx = Object.keys(acc).length;

          acc[strategy.raw.outputToken?.symbol] = tokensContractData[idx] as bigint;
        }

        return acc;
      },
      {} as Record<keyof typeof tokenToIdMapping, bigint>
    );
  }, [strategies, tokensContractData]);

  // get prices
  const { getPrice } = usePrices();

  const strategiesData = useMemo(
    () =>
      strategies?.map((strategy) => {
        const symbol = strategy.raw.outputToken?.symbol;

        if (hasUnderlyingToken(symbol) && seTokenContractDataCalls?.[symbol]) {
          const [exchangeRateStored, totalSupply] = seTokenContractDataCalls[symbol];

          const totalSuppleInUnderlyingAsset = exchangeRateStored * totalSupply;
          const underlyingAssetTicker = seTokensToUnderlyingMapping[symbol];

          return {
            ...strategy,
            tvl: (totalSuppleInUnderlyingAsset * BigInt(getPrice(underlyingAssetTicker!))) / BigInt(1e18)
          };
        }

        if (hasCGId(symbol) && tokensContractDataCalls?.[symbol]) {
          const totalSupply = tokensContractDataCalls[symbol];
          const assetTicker = tokenToIdMapping[symbol];

          return {
            ...strategy,
            tvl: (totalSupply * BigInt(getPrice(assetTicker!))) / BigInt(1e18)
          };
        }

        return {
          ...strategy,
          tvl: null
        };
      }),
    [strategies, seTokenContractDataCalls, getPrice, tokensContractDataCalls]
  );

  return { ...rest, data: strategiesData, isLoading: isStrategiesLoading };
};

export { useGetStakingStrategies };
export type { StrategyData };
