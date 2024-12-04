import { GatewayStrategyContract } from '@gobob/bob-sdk';
import { ChainId } from '@gobob/chains';
import { ERC20Token, Token } from '@gobob/currency';
import { useCallback, useMemo } from 'react';
import { useReadContracts } from 'wagmi';
import { CurrencyTickers, usePrices } from '@gobob/hooks';
import { Address, erc20Abi } from 'viem';
import Big from 'big.js';

import { useGetStrategies } from '@/hooks';
import { seTokenAbi } from '@/abis/seToken.abi';
import { strategyBaseTVLLimitAbi } from '@/abis/StrategyBaseTVL.abi';

type StrategyData = {
  raw: GatewayStrategyContract;
  currency?: ERC20Token;
};

const seTokenToUnderlyingMapping: Record<string, CurrencyTickers> = {
  seSOLVBTCBBN: CurrencyTickers['SolvBTC.BBN'],
  seUNIBTC: CurrencyTickers.UNIBTC,
  seTBTC: CurrencyTickers.TBTC,
  seWBTC: CurrencyTickers.WBTC
};

function hasUnderlying(symbol: string | undefined): symbol is keyof typeof seTokenToUnderlyingMapping {
  if (typeof symbol === 'undefined') return false;

  return Boolean(seTokenToUnderlyingMapping[symbol]);
}

const tokenToIdMapping: Record<string, CurrencyTickers> = {
  uniBTC: CurrencyTickers.UNIBTC,
  'SolvBTC.BBN': CurrencyTickers['SolvBTC.BBN']
};

function hasCGId(symbol: string | undefined): symbol is keyof typeof tokenToIdMapping {
  if (typeof symbol === 'undefined') return false;

  return Boolean(tokenToIdMapping[symbol]);
}

// strategy contract -> StrategyBaseTVLLimits contract
const strategyToLimitsMapping: Record<string, Address> = {
  // PellSolvLSTStrategy
  // "Pell (SolvBTC.BBN) -> pellStrategy (0x046DaeB4a46d83FC655a905aB352afbe981Cbd29) -> pellStrategy (0x6f0AfADE16BFD2E7f5515634f2D0E3cd03C845Ef) -> totalShares
  '0xdf3aa56f2626e253b5db7703ac7241e835140566': '0x6f0AfADE16BFD2E7f5515634f2D0E3cd03C845Ef',
  // PellBedrockStrategy
  // Pell (uniBTC) -> pellStrategy (0xa5bB4f96AE058FA13bb3960103276063b6EaD666) -> pellStrategy (0x631ae97e24f9F30150d31d958d37915975F12ed8) -> totalShares
  '0xf5f2f90d3edc557b7ff0a285169a0b194df7b6f2': '0x631ae97e24f9F30150d31d958d37915975F12ed8'
};

type UnderlyingTicker = string;
type UnderlyingDecimals = number;
const limitsToUnderlyingMapping: Record<string, [UnderlyingTicker, UnderlyingDecimals]> = {
  '0x6f0AfADE16BFD2E7f5515634f2D0E3cd03C845Ef': [CurrencyTickers['SolvBTC.BBN'], 18],
  '0x631ae97e24f9F30150d31d958d37915975F12ed8': [CurrencyTickers.UNIBTC, 8]
};

function hasNoOutputToken(strategyAddress: string): strategyAddress is keyof typeof strategyToLimitsMapping {
  if (typeof strategyAddress === 'undefined') return false;

  return Boolean(strategyToLimitsMapping[strategyAddress]);
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

  const { data: strategies, isSuccess: isStrategiesSucess } = useGetStrategies({
    select: selectStrategyData
  });

  // se tokens contract data
  const { data: seTokensContractData } = useReadContracts({
    query: {
      enabled: isStrategiesSucess
    },
    allowFailure: false,
    contracts: strategies?.flatMap((strategy) =>
      hasUnderlying(strategy.raw.outputToken?.symbol)
        ? ([
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
              functionName: 'underlying'
            }
          ] as const)
        : ([] as const)
    )
  });

  const seTokenContractDataCalls = useMemo(() => {
    if (!strategies) return null;

    return strategies.reduce(
      (acc, strategy) => {
        if (hasUnderlying(strategy.raw.outputToken?.symbol) && seTokensContractData) {
          const idx = Object.keys(acc).length * 3;

          // for each se* token we need tulpes of 3 call results
          acc[strategy.raw.outputToken?.symbol] = seTokensContractData.slice(idx, idx + 3) as [bigint, bigint, Address];
        }

        return acc;
      },
      {} as Record<keyof typeof seTokenToUnderlyingMapping, [bigint, bigint, Address]>
    );
  }, [seTokensContractData, strategies]);

  // se tokens underlying contract data
  const { data: seTokensUnderlyingContractData } = useReadContracts({
    query: {
      enabled: isStrategiesSucess
    },
    allowFailure: false,
    contracts: strategies?.flatMap((strategy) =>
      hasUnderlying(strategy.raw.outputToken?.symbol)
        ? ([
            {
              address: seTokenContractDataCalls?.[strategy.raw.outputToken?.symbol]?.[2] as Address,
              abi: erc20Abi,
              functionName: 'decimals'
            }
          ] as const)
        : ([] as const)
    )
  });

  const seTokenUnderlyingContractDataCalls = useMemo(() => {
    if (!strategies) return null;

    return strategies.reduce(
      (acc, strategy) => {
        if (hasUnderlying(strategy.raw.outputToken?.symbol) && seTokensUnderlyingContractData) {
          const idx = Object.keys(acc).length;

          acc[strategy.raw.outputToken?.symbol] = seTokensUnderlyingContractData[idx] as number;
        }

        return acc;
      },
      {} as Record<keyof typeof seTokenToUnderlyingMapping, number>
    );
  }, [seTokensUnderlyingContractData, strategies]);

  // erc20 tokens contract data
  const { data: tokensContractData } = useReadContracts({
    query: {
      enabled: isStrategiesSucess
    },
    allowFailure: false,
    contracts: strategies?.flatMap((strategy) =>
      hasCGId(strategy.raw.outputToken?.symbol)
        ? ([
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
          ] as const)
        : ([] as const)
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

  // no output token strategies contract data
  const { data: noOuputTokenContractData } = useReadContracts({
    query: {
      enabled: isStrategiesSucess
    },
    allowFailure: false,
    contracts: strategies?.flatMap((strategy) =>
      hasNoOutputToken(strategy.raw.address)
        ? ([
            {
              address: strategyToLimitsMapping[strategy.raw.address] as Address,
              abi: strategyBaseTVLLimitAbi,
              functionName: 'totalShares'
            }
          ] as const)
        : ([] as const)
    )
  });

  const noOuputTokenContractDataCalls = useMemo(() => {
    if (!strategies) return null;

    return strategies.reduce(
      (acc, strategy) => {
        if (hasNoOutputToken(strategy.raw.address) && noOuputTokenContractData) {
          const idx = Object.keys(acc).length;

          acc[strategy.raw.address] = noOuputTokenContractData[idx] as bigint;
        }

        return acc;
      },
      {} as Record<keyof typeof tokenToIdMapping, bigint>
    );
  }, [noOuputTokenContractData, strategies]);

  const { data: noOuputTokenContractSharesToUnderlyingData } = useReadContracts({
    query: {
      enabled: isStrategiesSucess
    },
    allowFailure: false,
    contracts: strategies?.flatMap((strategy) =>
      hasNoOutputToken(strategy.raw.address) && noOuputTokenContractDataCalls?.[strategy.raw.address]
        ? ([
            {
              address: strategyToLimitsMapping[strategy.raw.address] as Address,
              abi: strategyBaseTVLLimitAbi,
              functionName: 'sharesToUnderlyingView',
              args: [noOuputTokenContractDataCalls[strategy.raw.address]]
            }
          ] as const)
        : ([] as const)
    )
  });

  const noOuputTokenContractSharesToUnderlyingDataCalls = useMemo(() => {
    if (!strategies) return null;

    return strategies.reduce(
      (acc, strategy) => {
        if (hasNoOutputToken(strategy.raw.address) && noOuputTokenContractSharesToUnderlyingData) {
          const idx = Object.keys(acc).length;

          acc[strategy.raw.address] = noOuputTokenContractSharesToUnderlyingData[idx] as bigint;
        }

        return acc;
      },
      {} as Record<keyof typeof tokenToIdMapping, bigint>
    );
  }, [noOuputTokenContractSharesToUnderlyingData, strategies]);

  // get prices
  const { getPrice } = usePrices();

  const strategiesData = useMemo(
    () =>
      strategies?.map((strategy) => {
        const symbol = strategy.raw.outputToken?.symbol;

        if (
          hasUnderlying(symbol) &&
          seTokenContractDataCalls?.[symbol] &&
          seTokenUnderlyingContractDataCalls?.[symbol]
        ) {
          // `(totalCash + totalBorrows - totalReserves)` is multiplied by 1e18 to perform uint division
          // exchangeRate = (totalCash + totalBorrows - totalReserves) / totalSupply
          const [exchangeRateStored, totalSupply] = seTokenContractDataCalls[symbol]!;
          const underlyingDecimals = seTokenUnderlyingContractDataCalls[symbol]!;

          const totalSupplyInUnderlyingAsset = exchangeRateStored * totalSupply;
          const underlyingTicker = seTokenToUnderlyingMapping[symbol];
          const underlyingPrice = getPrice(underlyingTicker!);

          return {
            ...strategy,
            tvl: new Big(totalSupplyInUnderlyingAsset.toString())
              .mul(underlyingPrice)
              .div(1e18)
              .div(10 ** underlyingDecimals)
              .toNumber()
          };
        }

        if (hasCGId(symbol) && tokensContractDataCalls?.[symbol]) {
          const [totalSupply, decimals] = tokensContractDataCalls[symbol]!;
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

        const strategyAddress = strategy.raw.address;

        if (hasNoOutputToken(strategyAddress) && noOuputTokenContractSharesToUnderlyingDataCalls?.[strategyAddress]) {
          const totalSharesToUnderlying = noOuputTokenContractSharesToUnderlyingDataCalls[strategyAddress]!;
          const limitsContractAddress = strategyToLimitsMapping[strategyAddress]!;
          const [ticker, decimals] = limitsToUnderlyingMapping[limitsContractAddress]!;
          const price = getPrice(ticker!);

          return {
            ...strategy,
            tvl: new Big(totalSharesToUnderlying.toString())
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
    [
      strategies,
      seTokenContractDataCalls,
      seTokenUnderlyingContractDataCalls,
      tokensContractDataCalls,
      noOuputTokenContractSharesToUnderlyingDataCalls,
      getPrice
    ]
  );

  return { data: strategiesData };
};

export { useGetStakingStrategies };
export type { StrategyData };
