import { CurrencyTickers, usePrices } from '@gobob/hooks';
import { Address, erc20Abi, zeroAddress } from 'viem';
import { useCallback, useMemo } from 'react';
import { useAccount, useReadContracts } from 'wagmi';
import { bob } from 'viem/chains';
import Big from 'big.js';
import { Currency, CurrencyAmount, Token } from '@gobob/currency';
import { ChainId } from '@gobob/chains';

import { StrategyData } from './useGetStakingStrategies';

import { getConfig } from '@/lib/wagmi';
import { INTERVAL, isProd } from '@/constants';
import { seTokenAbi } from '@/abis/seToken.abi';
import { strategyBaseTVLLimitAbi } from '@/abis/StrategyBaseTVL.abi';

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
export const strategyToLimitsMapping: Record<string, Address> = {
  // PellSolvLSTStrategy
  // "Pell (SolvBTC.BBN) -> pellStrategy (0x046DaeB4a46d83FC655a905aB352afbe981Cbd29) -> pellStrategy (0x6f0AfADE16BFD2E7f5515634f2D0E3cd03C845Ef) -> totalShares
  '0xdf3aa56f2626e253b5db7703ac7241e835140566': '0x6f0AfADE16BFD2E7f5515634f2D0E3cd03C845Ef',
  // PellBedrockStrategy
  // Pell (uniBTC) -> pellStrategy (0xa5bB4f96AE058FA13bb3960103276063b6EaD666) -> pellStrategy (0x631ae97e24f9F30150d31d958d37915975F12ed8) -> totalShares
  '0xf5f2f90d3edc557b7ff0a285169a0b194df7b6f2': '0x631ae97e24f9F30150d31d958d37915975F12ed8'
};

type UnderlyingTicker = string;
type UnderlyingDecimals = number;
export const limitsToUnderlyingMapping: Record<string, [UnderlyingTicker, Address, UnderlyingDecimals]> = {
  '0x6f0AfADE16BFD2E7f5515634f2D0E3cd03C845Ef': [
    CurrencyTickers['SolvBTC.BBN'],
    '0xCC0966D8418d412c599A6421b760a847eB169A8c',
    18
  ],
  '0x631ae97e24f9F30150d31d958d37915975F12ed8': [
    CurrencyTickers.UNIBTC,
    '0x236f8c0a61dA474dB21B693fB2ea7AAB0c803894',
    8
  ]
};

function hasNoOutputToken(strategyAddress: string): strategyAddress is keyof typeof strategyToLimitsMapping {
  if (typeof strategyAddress === 'undefined') return false;

  return Boolean(strategyToLimitsMapping[strategyAddress]);
}

const useStrategiesContractData = (
  strategies: StrategyData[] | undefined,
  { enabled = true }: { enabled?: boolean }
) => {
  const { address } = useAccount();

  // se tokens contract data
  const seTokenContractDataSelector = useCallback(
    (data: (bigint | number | Address)[]) => {
      if (!strategies) return null;

      return strategies.reduce(
        (acc, strategy) => {
          if (hasUnderlying(strategy.raw.outputToken?.symbol) && data) {
            const idx = Object.keys(acc).length * 5;

            // for each se* token we need tulpes of 5 call results
            acc[strategy.raw.outputToken?.symbol] = data.slice(idx, idx + 5) as [
              bigint,
              bigint,
              bigint,
              number,
              Address
            ];
          }

          return acc;
        },
        {} as Record<keyof typeof seTokenToUnderlyingMapping, [bigint, bigint, bigint, number, Address]>
      );
    },
    [strategies]
  );

  const { data: seTokensContractData } = useReadContracts({
    query: {
      enabled,
      select: seTokenContractDataSelector,
      refetchInterval: INTERVAL.HOUR
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
              functionName: 'balanceOf',
              args: address ? [address] : [zeroAddress]
            },
            {
              address: strategy.raw.outputToken.address as Address,
              abi: seTokenAbi,
              functionName: 'decimals'
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
      select: seTokenUnderlyingContractDataSelector,
      refetchInterval: INTERVAL.HOUR
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
              address: seTokensContractData?.[strategy.raw.outputToken?.symbol]?.[4] as Address,
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
            const idx = Object.keys(acc).length * 3;

            acc[strategy.raw.outputToken?.symbol] = data.slice(idx, idx + 3) as [bigint, number, bigint];
          }

          return acc;
        },
        {} as Record<keyof typeof tokenToIdMapping, [bigint, number, bigint]>
      );
    },
    [strategies]
  );

  const { data: tokensContractData } = useReadContracts({
    query: {
      enabled,
      select: tokensContractDataSelector,
      refetchInterval: INTERVAL.HOUR
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
            },
            {
              address: strategy.raw.outputToken.address as Address,
              abi: erc20Abi,
              functionName: 'balanceOf',
              args: address ? [address] : [zeroAddress]
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
            const idx = Object.keys(acc).length * 2;

            acc[strategy.raw.address] = data.slice(idx, idx + 2) as [bigint, bigint];
          }

          return acc;
        },
        {} as Record<keyof typeof tokenToIdMapping, [bigint, bigint]>
      );
    },
    [strategies]
  );

  const { data: noOuputTokenContractData } = useReadContracts({
    query: {
      enabled,
      select: noOuputTokenContractDataSelector,
      refetchInterval: INTERVAL.HOUR
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
            },
            {
              address: strategyToLimitsMapping[strategy.raw.address] as Address,
              abi: strategyBaseTVLLimitAbi,
              functionName: 'shares',
              args: address ? [address] : [zeroAddress]
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
      select: noOuputTokenContractSharesToUnderlyingDataSelector,
      refetchInterval: INTERVAL.HOUR
    },
    allowFailure: false,
    contracts: strategies?.flatMap((strategy) =>
      hasNoOutputToken(strategy.raw.address) && noOuputTokenContractData?.[strategy.raw.address]
        ? ([
            {
              address: strategyToLimitsMapping[strategy.raw.address] as Address,
              abi: strategyBaseTVLLimitAbi,
              functionName: 'sharesToUnderlyingView',
              args: [noOuputTokenContractData[strategy.raw.address]?.[0]]
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
          const address = strategy.raw.outputToken?.address;

          if (hasUnderlying(symbol) && seTokensContractData?.[symbol] && seTokensUnderlyingContractData?.[symbol]) {
            // `(totalCash + totalBorrows - totalReserves)` is multiplied by 1e18 to perform uint division
            // exchangeRate = (totalCash + totalBorrows - totalReserves) / totalSupply
            const [exchangeRateStored, totalSupply, userStaked, decimals] = seTokensContractData[symbol]!;
            const underlyingDecimals = seTokensUnderlyingContractData[symbol]!;

            const totalSupplyInUnderlyingAsset = exchangeRateStored * totalSupply;
            const underlyingTicker = seTokenToUnderlyingMapping[symbol];
            const underlyingPrice = getPrice(underlyingTicker!);

            acc[strategy.raw.id] = {
              tvl: new Big(totalSupplyInUnderlyingAsset.toString())
                .mul(underlyingPrice)
                .div(1e18)
                .div(10 ** underlyingDecimals)
                .toNumber(),
              userStaked: CurrencyAmount.fromRawAmount(
                new Token(ChainId.BOB, address as Address, decimals, symbol, symbol),
                userStaked
              )
            };
          }

          if (hasCGId(symbol) && tokensContractData?.[symbol]) {
            const [totalSupply, decimals, userStaked] = tokensContractData[symbol]!;
            const ticker = tokenToIdMapping[symbol]!;
            const price = getPrice(ticker!);

            acc[strategy.raw.id] = {
              tvl: new Big(totalSupply.toString())
                .mul(price)
                .div(10 ** decimals)
                .toNumber(),
              userStaked: CurrencyAmount.fromRawAmount(
                new Token(ChainId.BOB, address as Address, decimals, symbol, symbol),
                userStaked
              )
            };
          }

          const strategyAddress = strategy.raw.address;

          if (
            hasNoOutputToken(strategyAddress) &&
            noOuputTokenContractSharesToUnderlyingData?.[strategyAddress] &&
            noOuputTokenContractData?.[strategyAddress]
          ) {
            const totalSharesToUnderlying = noOuputTokenContractSharesToUnderlyingData[strategyAddress]!;
            const limitsContractAddress = strategyToLimitsMapping[strategyAddress]!;
            const [ticker, address, decimals] = limitsToUnderlyingMapping[limitsContractAddress]!;
            const [, userStaked] = noOuputTokenContractData[strategyAddress]!;
            const price = getPrice(ticker!);

            acc[strategy.raw.id] = {
              tvl: new Big(totalSharesToUnderlying.toString())
                .mul(price)
                .div(10 ** decimals)
                .toNumber(),
              userStaked: CurrencyAmount.fromRawAmount(
                // NOTE: ticker is incorrect but we will use it anyway because the strategy has no output token
                new Token(ChainId.BOB, address, decimals, ticker, ticker),
                userStaked
              )
            };
          }

          return acc;
        },
        {} as Record<string, { tvl: number; userStaked: CurrencyAmount<Currency> }>
      ),
    [
      strategies,
      noOuputTokenContractData,
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
