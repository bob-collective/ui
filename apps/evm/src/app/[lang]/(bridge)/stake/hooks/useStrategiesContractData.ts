import { CurrencyTicker, usePrices } from '@gobob/hooks';
import { Address, erc20Abi, zeroAddress } from 'viem';
import { useCallback, useMemo } from 'react';
import { useAccount, useReadContracts } from 'wagmi';
import { bob } from 'viem/chains';
import Big from 'big.js';
import { Currency, CurrencyAmount, Token } from '@gobob/currency';
import { ChainId } from '@gobob/chains';

import { StrategyData } from './useGetStrategies';

import { getConfig } from '@/lib/wagmi';
import { INTERVAL, isProd } from '@/constants';
import { erc20WithUnderlying } from '@/abis/erc20WithUnderlying.abi';
import { strategyBaseTVLLimitAbi } from '@/abis/StrategyBaseTVL.abi';

type StrategyDepositData = { amount: CurrencyAmount<Currency>; usd: number };

const segmentTokenToUnderlyingMapping: Record<string, CurrencyTicker> = {
  seSOLVBTCBBN: CurrencyTicker['SolvBTC.BBN'],
  seUNIBTC: CurrencyTicker.UNIBTC,
  seTBTC: CurrencyTicker.TBTC,
  seWBTC: CurrencyTicker.WBTC
};

function isSegmentToken(symbol: string | undefined): symbol is keyof typeof segmentTokenToUnderlyingMapping {
  if (typeof symbol === 'undefined') return false;

  return Boolean(segmentTokenToUnderlyingMapping[symbol]);
}

const ionicTokenToUnderlyingMapping: Record<string, CurrencyTicker> = {
  iontBTC: CurrencyTicker.TBTC,
  ionWBTC: CurrencyTicker.WBTC
};

function isIonicToken(symbol: string | undefined): symbol is keyof typeof ionicTokenToUnderlyingMapping {
  if (typeof symbol === 'undefined') return false;

  return Boolean(ionicTokenToUnderlyingMapping[symbol]);
}

const tokenToIdMapping: Record<string, CurrencyTicker> = {
  uniBTC: CurrencyTicker.UNIBTC,
  'SolvBTC.BBN': CurrencyTicker['SolvBTC.BBN'],
  aBOBTBTC: CurrencyTicker.TBTC,
  aBOBWBTC: CurrencyTicker.WBTC,
  aBOBSOLVBTCBBN: CurrencyTicker['SolvBTC.BBN']
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
const limitsToUnderlyingMapping: Record<string, [UnderlyingTicker, Address, UnderlyingDecimals]> = {
  '0x6f0AfADE16BFD2E7f5515634f2D0E3cd03C845Ef': [
    CurrencyTicker['SolvBTC.BBN'],
    '0xCC0966D8418d412c599A6421b760a847eB169A8c',
    18
  ],
  '0x631ae97e24f9F30150d31d958d37915975F12ed8': [CurrencyTicker.UNIBTC, '0x236f8c0a61dA474dB21B693fB2ea7AAB0c803894', 8]
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

  // segment tokens contract data
  const segmentTokensWithUnderlyingContractDataSelector = useCallback(
    (data: (bigint | number | Address)[]) => {
      if (!strategies) return null;

      return strategies.reduce(
        (acc, strategy) => {
          if (isSegmentToken(strategy.contract.outputToken?.symbol) && data) {
            const idx = Object.keys(acc).length * 5;

            // for each se* token we need tulpes of 5 call results
            acc[strategy.contract.outputToken?.symbol] = data.slice(idx, idx + 5) as [
              bigint,
              bigint,
              bigint,
              number,
              Address
            ];
          }

          return acc;
        },
        {} as Record<keyof typeof segmentTokenToUnderlyingMapping, [bigint, bigint, bigint, number, Address]>
      );
    },
    [strategies]
  );

  const { data: segmentTokensWithUnderlyingContractData, isPending: isSegmentTokensWithUnderlyingContractPending } =
    useReadContracts({
      query: {
        enabled,
        select: segmentTokensWithUnderlyingContractDataSelector,
        refetchInterval: INTERVAL.HOUR
      },
      allowFailure: false,
      config: {
        ...getConfig({ isProd: isProd }),
        chains: [bob]
      },
      contracts: strategies?.flatMap((strategy) =>
        isSegmentToken(strategy.contract.outputToken?.symbol)
          ? ([
              {
                address: strategy.contract.outputToken.address as Address,
                abi: erc20WithUnderlying,
                functionName: 'exchangeRateStored'
              },
              {
                address: strategy.contract.outputToken.address as Address,
                abi: erc20WithUnderlying,
                functionName: 'totalSupply'
              },
              {
                address: strategy.contract.outputToken.address as Address,
                abi: erc20WithUnderlying,
                functionName: 'balanceOf',
                args: address ? [address] : [zeroAddress]
              },
              {
                address: strategy.contract.outputToken.address as Address,
                abi: erc20WithUnderlying,
                functionName: 'decimals'
              },
              {
                address: strategy.contract.outputToken.address as Address,
                abi: erc20WithUnderlying,
                functionName: 'underlying'
              }
            ] as const)
          : ([] as const)
      )
    });

  // segment tokens underlying contract data
  const segmentTokenUnderlyingContractDataSelector = useCallback(
    (data: number[]) => {
      if (!strategies) return null;

      return strategies.reduce(
        (acc, strategy) => {
          if (isSegmentToken(strategy.contract.outputToken?.symbol) && data) {
            const idx = Object.keys(acc).length;

            acc[strategy.contract.outputToken?.symbol] = data[idx] as number;
          }

          return acc;
        },
        {} as Record<keyof typeof segmentTokenToUnderlyingMapping, number>
      );
    },
    [strategies]
  );

  const { data: segmentTokenUnderlyingContractData, isPending: isSegmentTokenUnderlyingContractPending } =
    useReadContracts({
      query: {
        enabled,
        select: segmentTokenUnderlyingContractDataSelector,
        refetchInterval: INTERVAL.HOUR
      },
      allowFailure: false,
      config: {
        ...getConfig({ isProd }),
        chains: [bob]
      },
      contracts: strategies?.flatMap((strategy) =>
        isSegmentToken(strategy.contract.outputToken?.symbol)
          ? ([
              {
                address: segmentTokensWithUnderlyingContractData?.[
                  strategy.contract.outputToken?.symbol
                ]?.[4] as Address,
                abi: erc20Abi,
                functionName: 'decimals'
              }
            ] as const)
          : ([] as const)
      )
    });

  // ionic tokens contract data
  const ionicTokensWithUnderlyingContractDataSelector = useCallback(
    (data: (bigint | number | Address)[]) => {
      if (!strategies) return null;

      return strategies.reduce(
        (acc, strategy) => {
          if (isIonicToken(strategy.contract.outputToken?.symbol) && data) {
            const idx = Object.keys(acc).length * 3;

            acc[strategy.contract.outputToken?.symbol] = data.slice(idx, idx + 3) as [bigint, number, Address];
          }

          return acc;
        },
        {} as Record<keyof typeof ionicTokenToUnderlyingMapping, [bigint, number, Address]>
      );
    },
    [strategies]
  );

  const { data: ionicTokensWithUnderlyingContractData, isPending: isIonicTokensWithUnderlyingContractPending } =
    useReadContracts({
      query: {
        enabled,
        select: ionicTokensWithUnderlyingContractDataSelector,
        refetchInterval: INTERVAL.HOUR
      },
      allowFailure: false,
      config: {
        ...getConfig({ isProd: isProd }),
        chains: [bob]
      },
      contracts: strategies?.flatMap((strategy) =>
        isIonicToken(strategy.contract.outputToken?.symbol)
          ? ([
              {
                address: strategy.contract.outputToken.address as Address,
                abi: erc20WithUnderlying,
                functionName: 'balanceOf',
                args: address ? [address] : [zeroAddress]
              },
              {
                address: strategy.contract.outputToken.address as Address,
                abi: erc20WithUnderlying,
                functionName: 'decimals'
              },
              {
                address: strategy.contract.outputToken.address as Address,
                abi: erc20WithUnderlying,
                functionName: 'underlying'
              }
            ] as const)
          : ([] as const)
      )
    });

  // ionic tokens underlying contract data
  const ionicTokenUnderlyingContractDataSelector = useCallback(
    (data: (number | bigint)[]) => {
      if (!strategies) return null;

      return strategies.reduce(
        (acc, strategy) => {
          if (isIonicToken(strategy.contract.outputToken?.symbol) && data) {
            const idx = Object.keys(acc).length * 2;

            acc[strategy.contract.outputToken?.symbol] = data.slice(idx, idx + 2) as [bigint, number];
          }

          return acc;
        },
        {} as Record<keyof typeof ionicTokenToUnderlyingMapping, [bigint, number]>
      );
    },
    [strategies]
  );

  const { data: ionicTokenUnderlyingContractData, isPending: isIonicTokenUnderlyingContractPending } = useReadContracts(
    {
      query: {
        enabled,
        select: ionicTokenUnderlyingContractDataSelector,
        refetchInterval: INTERVAL.HOUR
      },
      allowFailure: false,
      config: {
        ...getConfig({ isProd }),
        chains: [bob]
      },
      contracts: strategies?.flatMap((strategy) =>
        isIonicToken(strategy.contract.outputToken?.symbol) &&
        ionicTokensWithUnderlyingContractData?.[strategy.contract.outputToken?.symbol]?.[2]
          ? ([
              {
                address: ionicTokensWithUnderlyingContractData?.[strategy.contract.outputToken?.symbol]?.[2] as Address,
                abi: erc20Abi,
                functionName: 'balanceOf',
                args: [strategy.contract.outputToken.address]
              },
              {
                address: ionicTokensWithUnderlyingContractData?.[strategy.contract.outputToken?.symbol]?.[2] as Address,
                abi: erc20Abi,
                functionName: 'decimals'
              }
            ] as const)
          : ([] as const)
      )
    }
  );

  // erc20 tokens contract data
  const tokensContractDataSelector = useCallback(
    (data: (number | bigint)[]) => {
      if (!strategies) return null;

      return strategies.reduce(
        (acc, strategy) => {
          if (hasCGId(strategy.contract.outputToken?.symbol) && data) {
            const idx = Object.keys(acc).length * 3;

            acc[strategy.contract.outputToken?.symbol] = data.slice(idx, idx + 3) as [bigint, number, bigint];
          }

          return acc;
        },
        {} as Record<keyof typeof tokenToIdMapping, [bigint, number, bigint]>
      );
    },
    [strategies]
  );

  const { data: tokensContractData, isPending: isTokensContractDataPending } = useReadContracts({
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
      hasCGId(strategy.contract.outputToken?.symbol)
        ? ([
            {
              address: strategy.contract.outputToken.address as Address,
              abi: erc20Abi,
              functionName: 'totalSupply'
            },
            {
              address: strategy.contract.outputToken.address as Address,
              abi: erc20Abi,
              functionName: 'decimals'
            },
            {
              address: strategy.contract.outputToken.address as Address,
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
          if (hasNoOutputToken(strategy.contract.address) && data) {
            const idx = Object.keys(acc).length * 2;

            acc[strategy.contract.address] = data.slice(idx, idx + 2) as [bigint, bigint];
          }

          return acc;
        },
        {} as Record<keyof typeof tokenToIdMapping, [bigint, bigint]>
      );
    },
    [strategies]
  );

  const { data: noOuputTokenContractData, isPending: isNoOuputTokenContractDataPending } = useReadContracts({
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
      hasNoOutputToken(strategy.contract.address)
        ? ([
            {
              address: strategyToLimitsMapping[strategy.contract.address] as Address,
              abi: strategyBaseTVLLimitAbi,
              functionName: 'totalShares'
            },
            {
              address: strategyToLimitsMapping[strategy.contract.address] as Address,
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
          if (hasNoOutputToken(strategy.contract.address) && data) {
            const idx = Object.keys(acc).length;

            acc[strategy.contract.address] = data[idx] as bigint;
          }

          return acc;
        },
        {} as Record<keyof typeof tokenToIdMapping, bigint>
      );
    },
    [strategies]
  );

  const {
    data: noOuputTokenContractSharesToUnderlyingData,
    isPending: isNoOuputTokenContractSharesToUnderlyingDataPending
  } = useReadContracts({
    query: {
      enabled,
      select: noOuputTokenContractSharesToUnderlyingDataSelector,
      refetchInterval: INTERVAL.HOUR
    },
    allowFailure: false,
    contracts: strategies?.flatMap((strategy) =>
      hasNoOutputToken(strategy.contract.address) && noOuputTokenContractData?.[strategy.contract.address]
        ? ([
            {
              address: strategyToLimitsMapping[strategy.contract.address] as Address,
              abi: strategyBaseTVLLimitAbi,
              functionName: 'sharesToUnderlyingView',
              args: [noOuputTokenContractData[strategy.contract.address]?.[0]]
            }
          ] as const)
        : ([] as const)
    )
  });

  // get prices
  const { getPrice, isPending: isPricesPending } = usePrices();

  const strategiesData = useMemo(
    () =>
      strategies?.reduce(
        (acc, strategy) => {
          const symbol = strategy.contract.outputToken?.symbol;
          const address = strategy.contract.outputToken?.address;

          if (
            isSegmentToken(symbol) &&
            segmentTokensWithUnderlyingContractData?.[symbol] &&
            segmentTokenUnderlyingContractData?.[symbol]
          ) {
            // `(totalCash + totalBorrows - totalReserves)` is multiplied by 1e18 to perform uint division
            // exchangeRate = (totalCash + totalBorrows - totalReserves) / totalSupply
            const [exchangeRateStored, totalSupply, balanceOf, decimals] =
              segmentTokensWithUnderlyingContractData[symbol]!;
            const underlyingDecimals = segmentTokenUnderlyingContractData[symbol]!;

            const totalSupplyInUnderlyingAsset = exchangeRateStored * totalSupply;
            const underlyingTicker = segmentTokenToUnderlyingMapping[symbol];
            const underlyingPrice = getPrice(underlyingTicker!);
            const depositAmount = CurrencyAmount.fromRawAmount(
              new Token(ChainId.BOB, address as Address, decimals, symbol, symbol),
              balanceOf
            );

            acc[strategy.contract.id] = {
              tvl: new Big(totalSupplyInUnderlyingAsset.toString())
                .mul(underlyingPrice)
                .div(1e18)
                .div(10 ** underlyingDecimals)
                .toNumber(),
              deposit:
                balanceOf > 0n
                  ? {
                      amount: depositAmount,
                      usd: new Big(depositAmount.toExact())
                        .mul(underlyingPrice)
                        .mul(exchangeRateStored.toString())
                        .div(10 ** underlyingDecimals)
                        .div(1e10)
                        .toNumber()
                    }
                  : undefined
            };
          }

          if (
            isIonicToken(symbol) &&
            ionicTokensWithUnderlyingContractData?.[symbol] &&
            ionicTokenUnderlyingContractData?.[symbol]
          ) {
            const [balanceOf, decimals] = ionicTokensWithUnderlyingContractData[symbol]!;
            const [underlyingBalanceOf, underlyingDecimals] = ionicTokenUnderlyingContractData[symbol]!;

            const underlyingTicker = ionicTokenToUnderlyingMapping[symbol];
            const underlyingPrice = getPrice(underlyingTicker!);
            const depositAmount = CurrencyAmount.fromRawAmount(
              new Token(ChainId.BOB, address as Address, decimals, symbol, symbol),
              balanceOf
            );

            acc[strategy.contract.id] = {
              tvl: new Big(underlyingBalanceOf.toString())
                .mul(underlyingPrice)
                .div(10 ** underlyingDecimals)
                .toNumber(),
              deposit:
                balanceOf > 0n
                  ? {
                      amount: depositAmount,
                      usd: new Big(depositAmount.toExact()).div(5).mul(underlyingPrice).toNumber()
                    }
                  : undefined
            };
          }

          if (hasCGId(symbol) && tokensContractData?.[symbol]) {
            const [totalSupply, decimals, balanceOf] = tokensContractData[symbol]!;
            const ticker = tokenToIdMapping[symbol]!;
            const price = getPrice(ticker!);
            const depositAmount = CurrencyAmount.fromRawAmount(
              new Token(ChainId.BOB, address as Address, decimals, symbol, symbol),
              balanceOf
            );

            acc[strategy.contract.id] = {
              tvl: new Big(totalSupply.toString())
                .mul(price)
                .div(10 ** decimals)
                .toNumber(),
              deposit:
                balanceOf > 0n
                  ? {
                      amount: depositAmount,
                      usd: new Big(depositAmount.toExact()).mul(price).toNumber()
                    }
                  : undefined
            };
          }

          const strategyAddress = strategy.contract.address;

          if (
            hasNoOutputToken(strategyAddress) &&
            noOuputTokenContractSharesToUnderlyingData?.[strategyAddress] &&
            noOuputTokenContractData?.[strategyAddress]
          ) {
            const totalSharesToUnderlying = noOuputTokenContractSharesToUnderlyingData[strategyAddress]!;
            const limitsContractAddress = strategyToLimitsMapping[strategyAddress]!;
            const [ticker, address, decimals] = limitsToUnderlyingMapping[limitsContractAddress]!;
            const [, balanceOf] = noOuputTokenContractData[strategyAddress]!;
            const price = getPrice(ticker!);
            const depositAmount = CurrencyAmount.fromRawAmount(
              // NOTE: ticker is incorrect but we will use it anyway because the strategy has no output token
              new Token(ChainId.BOB, address, decimals, ticker, ticker),
              balanceOf
            );

            acc[strategy.contract.id] = {
              tvl: new Big(totalSharesToUnderlying.toString())
                .mul(price)
                .div(10 ** decimals)
                .toNumber(),
              deposit:
                balanceOf > 0n
                  ? {
                      amount: depositAmount,
                      usd: new Big(depositAmount.toExact()).mul(price).toNumber()
                    }
                  : undefined
            };
          }

          return acc;
        },
        {} as Record<string, { tvl?: number; deposit?: StrategyDepositData }>
      ),
    [
      strategies,
      segmentTokensWithUnderlyingContractData,
      segmentTokenUnderlyingContractData,
      ionicTokensWithUnderlyingContractData,
      ionicTokenUnderlyingContractData,
      tokensContractData,
      noOuputTokenContractSharesToUnderlyingData,
      noOuputTokenContractData,
      getPrice
    ]
  );

  return {
    data: strategiesData,
    isPending:
      isIonicTokenUnderlyingContractPending ||
      isIonicTokensWithUnderlyingContractPending ||
      isSegmentTokensWithUnderlyingContractPending ||
      isNoOuputTokenContractDataPending ||
      isTokensContractDataPending ||
      isNoOuputTokenContractSharesToUnderlyingDataPending ||
      isSegmentTokenUnderlyingContractPending ||
      isPricesPending
  };
};

export { useStrategiesContractData };
export type { StrategyDepositData };
