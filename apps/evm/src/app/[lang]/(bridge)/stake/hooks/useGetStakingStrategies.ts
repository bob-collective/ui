import { GatewayStrategyContract } from '@gobob/bob-sdk';
import { ChainId } from '@gobob/chains';
import { ERC20Token, Token } from '@gobob/currency';
import { useCallback, useMemo } from 'react';
import { ResolvedRegister, useReadContracts } from 'wagmi';
import { CurrencyTickers, usePrices } from '@gobob/hooks';
import { Address, erc20Abi } from 'viem';
import Big from 'big.js';

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

function hasUnderlying(symbol: string | undefined): symbol is keyof typeof seTokensToUnderlyingMapping {
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
  const { data: seTokensContractData } = useReadContracts<
    unknown[],
    boolean,
    ResolvedRegister['config'],
    (bigint | number)[]
  >({
    query: {
      enabled: !isStrategiesLoading
    },
    allowFailure: false,
    contracts: strategies?.flatMap((strategy) =>
      hasUnderlying(strategy.raw.outputToken?.symbol)
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
            },
            {
              address: strategy.raw.outputToken.address as Address,
              abi: seTokenAbi,
              functionName: 'decimals'
            }
          ]
        : []
    )
  });

  const seTokenContractDataCalls = useMemo(() => {
    if (!strategies) return null;

    return strategies.reduce(
      (acc, strategy) => {
        if (hasUnderlying(strategy.raw.outputToken?.symbol) && seTokensContractData) {
          const idx = Object.keys(acc).length * 3;

          // for each se* token we need tulpes of 3 call results
          acc[strategy.raw.outputToken?.symbol] = seTokensContractData.slice(idx, idx + 3) as [bigint, bigint, number];
        }

        return acc;
      },
      {} as Record<keyof typeof seTokensToUnderlyingMapping, [bigint, bigint, number]>
    );
  }, [seTokensContractData, strategies]);

  // erc20 tokens contract data
  const { data: tokensContractData } = useReadContracts<
    unknown[],
    boolean,
    ResolvedRegister['config'],
    (bigint | number)[]
  >({
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
            },
            {
              address: strategy.raw.outputToken.address as Address,
              abi: erc20Abi,
              functionName: 'decimals'
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
          const idx = Object.keys(acc).length * 2;

          acc[strategy.raw.outputToken?.symbol] = tokensContractData.slice(idx, idx + 2) as [bigint, number];
        }

        return acc;
      },
      {} as Record<keyof typeof tokenToIdMapping, [bigint, number]>
    );
  }, [strategies, tokensContractData]);

  // get prices
  const { getPrice } = usePrices();

  const strategiesData = useMemo(
    () =>
      strategies?.map((strategy) => {
        const symbol = strategy.raw.outputToken?.symbol;

        if (hasUnderlying(symbol) && seTokenContractDataCalls?.[symbol]) {
          // `(totalCash + totalBorrows - totalReserves)` is multiplied by 1e18 to perform uint division
          // exchangeRate = (totalCash + totalBorrows - totalReserves) / totalSupply
          const [exchangeRateStored, totalSupply, decimals] = seTokenContractDataCalls[symbol];

          const totalSuppleInUnderlyingAsset = exchangeRateStored * totalSupply;
          const underlyingTicker = seTokensToUnderlyingMapping[symbol];
          const underlyingPrice = getPrice(underlyingTicker!);

          return {
            ...strategy,
            tvl: new Big(totalSuppleInUnderlyingAsset.toString())
              .mul(underlyingPrice)
              .div(1e18)
              .div(10 ** decimals)
              .toNumber()
          };
        }

        if (hasCGId(symbol) && tokensContractDataCalls?.[symbol]) {
          const [totalSupply, decimals] = tokensContractDataCalls[symbol];
          const ticker = tokenToIdMapping[symbol];
          const price = getPrice(ticker!);

          return {
            ...strategy,
            tvl: new Big(totalSupply.toString())
              .mul(price)
              .div(10 ** decimals)
              .toNumber()
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
