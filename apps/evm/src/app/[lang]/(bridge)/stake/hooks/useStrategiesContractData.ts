import { CurrencyTickers, usePrices } from '@gobob/hooks';
import { Address, erc20Abi } from 'viem';
import { StrategyData } from './useGetStakingStrategies';
import { useCallback, useMemo } from 'react';
import { useReadContracts } from 'wagmi';
import { getConfig } from '@/lib/wagmi';
import { bob } from 'viem/chains';
import { isProd } from '@/constants';

import { seTokenAbi } from '@/abis/seToken.abi';
import { strategyBaseTVLLimitAbi } from '@/abis/StrategyBaseTVL.abi';
import Big from 'big.js';

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

const useStrategiesContractData = (
  strategies: StrategyData[] | undefined,
  { enabled = true }: { enabled?: boolean }
) => {
  // se tokens contract data
  const seTokenContractDataSelector = useCallback(
    (data: (bigint | `0x${string}`)[]) => {
      if (!strategies) return null;

      return strategies.reduce(
        (acc, strategy) => {
          if (hasUnderlying(strategy.raw.outputToken?.symbol) && data) {
            const idx = Object.keys(acc).length * 3;

            // for each se* token we need tulpes of 3 call results
            acc[strategy.raw.outputToken?.symbol] = data.slice(idx, idx + 3) as [bigint, bigint, Address];
          }

          return acc;
        },
        {} as Record<keyof typeof seTokenToUnderlyingMapping, [bigint, bigint, Address]>
      );
    },
    [strategies]
  );

  const { data: seTokensContractData } = useReadContracts({
    query: {
      enabled,
      select: seTokenContractDataSelector
    },
    allowFailure: false,
    config: {
      ...getConfig({ isProd: isProd }),
      chains: [bob]
    },
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

  // se tokens underlying contract data
  const seTokenUnderlyingContractDataSelector = useCallback(
    (data: number[]) => {
      if (!strategies) return null;

      return strategies.reduce(
        (acc, strategy) => {
          if (hasUnderlying(strategy.raw.outputToken?.symbol) && data) {
            const idx = Object.keys(acc).length;

            acc[strategy.raw.outputToken?.symbol] = data[idx] as number;
          }

          return acc;
        },
        {} as Record<keyof typeof seTokenToUnderlyingMapping, number>
      );
    },
    [strategies]
  );

  const { data: seTokensUnderlyingContractData } = useReadContracts({
    query: {
      enabled,
      select: seTokenUnderlyingContractDataSelector
    },
    allowFailure: false,
    config: {
      ...getConfig({ isProd }),
      chains: [bob]
    },
    contracts: strategies?.flatMap((strategy) =>
      hasUnderlying(strategy.raw.outputToken?.symbol)
        ? ([
            {
              address: seTokensContractData?.[strategy.raw.outputToken?.symbol]?.[2] as Address,
              abi: erc20Abi,
              functionName: 'decimals'
            }
          ] as const)
        : ([] as const)
    )
  });

  // erc20 tokens contract data
  const tokensContractDataSelector = useCallback(
    (data: (number | bigint)[]) => {
      if (!strategies) return null;

      return strategies.reduce(
        (acc, strategy) => {
          if (hasCGId(strategy.raw.outputToken?.symbol) && data) {
            const idx = Object.keys(acc).length * 2;

            acc[strategy.raw.outputToken?.symbol] = data.slice(idx, idx + 2) as [bigint, number];
          }

          return acc;
        },
        {} as Record<keyof typeof tokenToIdMapping, [bigint, number]>
      );
    },
    [strategies]
  );

  const { data: tokensContractData } = useReadContracts({
    query: {
      enabled,
      select: tokensContractDataSelector
    },
    allowFailure: false,
    config: {
      ...getConfig({ isProd }),
      chains: [bob]
    },
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

  // no output token strategies contract data
  const noOuputTokenContractDataSelector = useCallback(
    (data: bigint[]) => {
      if (!strategies) return null;

      return strategies.reduce(
        (acc, strategy) => {
          if (hasNoOutputToken(strategy.raw.address) && data) {
            const idx = Object.keys(acc).length;

            acc[strategy.raw.address] = data[idx] as bigint;
          }

          return acc;
        },
        {} as Record<keyof typeof tokenToIdMapping, bigint>
      );
    },
    [strategies]
  );

  const { data: noOuputTokenContractData } = useReadContracts({
    query: {
      enabled,
      select: noOuputTokenContractDataSelector
    },
    allowFailure: false,
    config: {
      ...getConfig({ isProd }),
      chains: [bob]
    },
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

  const noOuputTokenContractSharesToUnderlyingDataSelector = useCallback(
    (data: bigint[]) => {
      if (!strategies) return null;

      return strategies.reduce(
        (acc, strategy) => {
          if (hasNoOutputToken(strategy.raw.address) && data) {
            const idx = Object.keys(acc).length;

            acc[strategy.raw.address] = data[idx] as bigint;
          }

          return acc;
        },
        {} as Record<keyof typeof tokenToIdMapping, bigint>
      );
    },
    [strategies]
  );

  const { data: noOuputTokenContractSharesToUnderlyingData } = useReadContracts({
    query: {
      enabled,
      select: noOuputTokenContractSharesToUnderlyingDataSelector
    },
    allowFailure: false,
    contracts: strategies?.flatMap((strategy) =>
      hasNoOutputToken(strategy.raw.address) && noOuputTokenContractData?.[strategy.raw.address]
        ? ([
            {
              address: strategyToLimitsMapping[strategy.raw.address] as Address,
              abi: strategyBaseTVLLimitAbi,
              functionName: 'sharesToUnderlyingView',
              args: [noOuputTokenContractData[strategy.raw.address]]
            }
          ] as const)
        : ([] as const)
    )
  });

  // get prices
  const { getPrice } = usePrices();

  const strategiesData = useMemo(
    () =>
      strategies?.reduce(
        (acc, strategy) => {
          const symbol = strategy.raw.outputToken?.symbol;

          if (hasUnderlying(symbol) && seTokensContractData?.[symbol] && seTokensUnderlyingContractData?.[symbol]) {
            // `(totalCash + totalBorrows - totalReserves)` is multiplied by 1e18 to perform uint division
            // exchangeRate = (totalCash + totalBorrows - totalReserves) / totalSupply
            const [exchangeRateStored, totalSupply] = seTokensContractData[symbol]!;
            const underlyingDecimals = seTokensUnderlyingContractData[symbol]!;

            const totalSupplyInUnderlyingAsset = exchangeRateStored * totalSupply;
            const underlyingTicker = seTokenToUnderlyingMapping[symbol];
            const underlyingPrice = getPrice(underlyingTicker!);

            acc[strategy.raw.id] = {
              tvl: new Big(totalSupplyInUnderlyingAsset.toString())
                .mul(underlyingPrice)
                .div(1e18)
                .div(10 ** underlyingDecimals)
                .toNumber()
            };
          }

          if (hasCGId(symbol) && tokensContractData?.[symbol]) {
            const [totalSupply, decimals] = tokensContractData[symbol]!;
            const ticker = tokenToIdMapping[symbol];
            const price = getPrice(ticker!);

            acc[strategy.raw.id] = {
              tvl: new Big(totalSupply.toString())
                .mul(price)
                .div(10 ** decimals)
                .toNumber()
            };
          }

          const strategyAddress = strategy.raw.address;

          if (hasNoOutputToken(strategyAddress) && noOuputTokenContractSharesToUnderlyingData?.[strategyAddress]) {
            const totalSharesToUnderlying = noOuputTokenContractSharesToUnderlyingData[strategyAddress]!;
            const limitsContractAddress = strategyToLimitsMapping[strategyAddress]!;
            const [ticker, decimals] = limitsToUnderlyingMapping[limitsContractAddress]!;
            const price = getPrice(ticker!);

            acc[strategy.raw.id] = {
              tvl: new Big(totalSharesToUnderlying.toString())
                .mul(price)
                .div(10 ** decimals)
                .toNumber()
            };
          }

          return acc;
        },
        {} as Record<string, { tvl: number }>
      ),
    [
      strategies,
      seTokensContractData,
      seTokensUnderlyingContractData,
      tokensContractData,
      noOuputTokenContractSharesToUnderlyingData,
      getPrice
    ]
  );

  return { data: strategiesData };
};

export { useStrategiesContractData };
