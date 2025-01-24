import { CurrencyAmount, Token } from '@gobob/currency';
import Big from 'big.js';
import { Address, erc20Abi, isAddress, zeroAddress } from 'viem';
import { ChainId } from '@gobob/chains';

import { erc20WithUnderlying } from '@/abis/erc20WithUnderlying.abi';
import { strategyBaseTVLLimitAbi } from '@/abis/StrategyBaseTVL.abi';
import { publicClientL2 } from '@/constants';
import { gatewaySDK } from '@/lib/bob-sdk';

enum PriceCurrency {
  USD = 'usd',
  BTC = 'btc',
  EUR = 'eur'
}

enum CurrencyTicker {
  ALEX = 'ALEX',
  DAI = 'DAI',
  DLLR = 'DLLR',
  ESOV = 'eSOV',
  ETH = 'ETH',
  RETH = 'rETH',
  STONE = 'STONE',
  TBTC = 'tBTC',
  USDC = 'USDC',
  USDT = 'USDT',
  WBTC = 'WBTC',
  WSTETH = 'wstETH',
  BTC = 'BTC',
  UNIBTC = 'uniBTC',
  'SolvBTC.BBN' = 'SOLVBTC.BBN',
  LBTC = 'LBTC'
}

// TODO: Add other supported currencies. Move.
// UPDATE: use assets file where each asset has an apiId
const COINGECKO_IDS = [
  'alexgo',
  'dai',
  'ethereum',
  'sovryn',
  'rocket-pool-eth',
  'stakestone-ether',
  'tbtc',
  'tether',
  'usd-coin',
  'wrapped-bitcoin',
  'wrapped-steth',
  'bitcoin',
  'sovryn-dollar',
  'solv-protocol-solvbtc-bbn',
  'universal-btc',
  'lombard-staked-btc'
] as const;

const COINGECKO_ID_BY_CURRENCY_TICKER: Record<string, (typeof COINGECKO_IDS)[number]> = {
  [CurrencyTicker.ALEX]: 'alexgo',
  [CurrencyTicker.DAI]: 'dai',
  [CurrencyTicker.DLLR]: 'sovryn-dollar',
  [CurrencyTicker.ESOV]: 'sovryn',
  [CurrencyTicker.ETH]: 'ethereum',
  [CurrencyTicker.RETH]: 'rocket-pool-eth',
  [CurrencyTicker.STONE]: 'stakestone-ether',
  [CurrencyTicker.TBTC]: 'tbtc',
  [CurrencyTicker.USDC]: 'usd-coin',
  [CurrencyTicker.USDT]: 'tether',
  [CurrencyTicker.WBTC]: 'wrapped-bitcoin',
  [CurrencyTicker.WSTETH]: 'wrapped-steth',
  [CurrencyTicker.BTC]: 'bitcoin',
  [CurrencyTicker['SolvBTC.BBN']]: 'solv-protocol-solvbtc-bbn',
  [CurrencyTicker.UNIBTC]: 'universal-btc',
  [CurrencyTicker.LBTC]: 'lombard-staked-btc'
};

// type StrategyDepositData = {
//   token: {
//     chainId: ChainId;
//     address: Address;
//     decimals: number;
//     name: CurrencyTicker | string;
//     symbol: CurrencyTicker | string;
//     value: string;
//   };
//   usd: number;
// };

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

const headers = {
  'content-type': 'application/json',
  'cache-control': 'public, max-age=120, s-maxage=120, stale-while-revalidate=300, stale-if-error=300'
};

const getPrices = async (_url: string) => {
  const vsCurrencies = PriceCurrency.USD;
  const ids = COINGECKO_IDS.join(',');

  const url = new URL('/api/prices', _url);

  url.searchParams.set('vs_currencies', vsCurrencies);
  url.searchParams.set('ids', ids);

  const response = await fetch(url);
  const json = await response.json();

  return json;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const address = url.searchParams.get('address');

  const [strategies, prices] = await Promise.all([gatewaySDK.getStrategies(), getPrices(request.url)]);

  const getPrice = (ticker: string, versusCurrency: PriceCurrency = PriceCurrency.USD) => {
    const cgId = COINGECKO_ID_BY_CURRENCY_TICKER[ticker];

    return prices?.[cgId!]?.[versusCurrency] || 0;
  };

  const segmentTokensWithUnderlyingCall = publicClientL2.multicall({
    allowFailure: false,
    contracts: strategies?.flatMap((strategy) =>
      isSegmentToken(strategy.outputToken?.symbol)
        ? ([
            {
              address: strategy.outputToken.address as Address,
              abi: erc20WithUnderlying,
              functionName: 'exchangeRateStored'
            },
            {
              address: strategy.outputToken.address as Address,
              abi: erc20WithUnderlying,
              functionName: 'totalSupply'
            },
            {
              address: strategy.outputToken.address as Address,
              abi: erc20WithUnderlying,
              functionName: 'balanceOf',
              args: isAddress(address ?? '') ? [address] : [zeroAddress]
            },
            {
              address: strategy.outputToken.address as Address,
              abi: erc20WithUnderlying,
              functionName: 'decimals'
            },
            {
              address: strategy.outputToken.address as Address,
              abi: erc20WithUnderlying,
              functionName: 'underlying'
            }
          ] as const)
        : ([] as const)
    )
  });

  const ionicTokensWithUnderlyingCall = publicClientL2.multicall({
    allowFailure: false,
    contracts: strategies?.flatMap((strategy) =>
      isIonicToken(strategy.outputToken?.symbol)
        ? ([
            {
              address: strategy.outputToken.address as Address,
              abi: erc20WithUnderlying,
              functionName: 'balanceOf',
              args: isAddress(address ?? '') ? [address] : [zeroAddress]
            },
            {
              address: strategy.outputToken.address as Address,
              abi: erc20WithUnderlying,
              functionName: 'decimals'
            },
            {
              address: strategy.outputToken.address as Address,
              abi: erc20WithUnderlying,
              functionName: 'underlying'
            }
          ] as const)
        : ([] as const)
    )
  });

  const tokensCall = publicClientL2.multicall({
    allowFailure: false,
    contracts: strategies?.flatMap((strategy) =>
      hasCGId(strategy.outputToken?.symbol)
        ? ([
            {
              address: strategy.outputToken.address as Address,
              abi: erc20Abi,
              functionName: 'totalSupply'
            },
            {
              address: strategy.outputToken.address as Address,
              abi: erc20Abi,
              functionName: 'decimals'
            },
            {
              address: strategy.outputToken.address as Address,
              abi: erc20Abi,
              functionName: 'balanceOf',
              args: isAddress(address ?? '') ? [address] : [zeroAddress]
            }
          ] as const)
        : ([] as const)
    )
  });

  const noOuputTokenCall = publicClientL2.multicall({
    allowFailure: false,
    contracts: strategies?.flatMap((strategy) =>
      hasNoOutputToken(strategy.address)
        ? ([
            {
              address: strategyToLimitsMapping[strategy.address] as Address,
              abi: strategyBaseTVLLimitAbi,
              functionName: 'totalShares'
            },
            {
              address: strategyToLimitsMapping[strategy.address] as Address,
              abi: strategyBaseTVLLimitAbi,
              functionName: 'shares',
              args: isAddress(address ?? '') ? [address] : [zeroAddress]
            }
          ] as const)
        : ([] as const)
    )
  });

  const [
    segmentTokensWithUnderlyingContractData,
    ionicTokensWithUnderlyingContractData,
    tokensContractData,
    noOuputTokenContractData
  ] = await Promise.all([segmentTokensWithUnderlyingCall, ionicTokensWithUnderlyingCall, tokensCall, noOuputTokenCall]);

  // segment tokens contract data
  const segmentTokensWithUnderlyingContractDataSelector = strategies.reduce(
    (acc, strategy) => {
      if (isSegmentToken(strategy.outputToken?.symbol)) {
        const idx = Object.keys(acc).length * 5;

        // for each se* token we need tulpes of 5 call results
        acc[strategy.outputToken?.symbol] = segmentTokensWithUnderlyingContractData.slice(idx, idx + 5) as [
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

  // ionic tokens contract data
  const ionicTokensWithUnderlyingContractDataSelector = strategies.reduce(
    (acc, strategy) => {
      if (isIonicToken(strategy.outputToken?.symbol)) {
        const idx = Object.keys(acc).length * 3;

        acc[strategy.outputToken?.symbol] = ionicTokensWithUnderlyingContractData.slice(idx, idx + 3) as [
          bigint,
          number,
          Address
        ];
      }

      return acc;
    },
    {} as Record<keyof typeof ionicTokenToUnderlyingMapping, [bigint, number, Address]>
  );

  // erc20 tokens contract data
  const tokensContractDataSelector = strategies.reduce(
    (acc, strategy) => {
      if (hasCGId(strategy.outputToken?.symbol)) {
        const idx = Object.keys(acc).length * 3;

        acc[strategy.outputToken?.symbol] = tokensContractData.slice(idx, idx + 3) as [bigint, number, bigint];
      }

      return acc;
    },
    {} as Record<keyof typeof tokenToIdMapping, [bigint, number, bigint]>
  );

  // no output token strategies contract data
  const noOuputTokenContractDataSelector = strategies.reduce(
    (acc, strategy) => {
      if (hasNoOutputToken(strategy.address)) {
        const idx = Object.keys(acc).length * 2;

        acc[strategy.address] = noOuputTokenContractData.slice(idx, idx + 2) as [bigint, bigint];
      }

      return acc;
    },
    {} as Record<keyof typeof tokenToIdMapping, [bigint, bigint]>
  );

  // ========

  const [
    segmentTokenUnderlyingContractData,
    ionicTokenUnderlyingContractData,
    noOuputTokenContractSharesToUnderlyingData
  ] = await Promise.all([
    publicClientL2.multicall({
      allowFailure: false,
      contracts: strategies?.flatMap((strategy) =>
        isSegmentToken(strategy.outputToken?.symbol)
          ? ([
              {
                address: segmentTokensWithUnderlyingContractDataSelector?.[
                  strategy.outputToken?.symbol
                ]?.[4] as Address,
                abi: erc20Abi,
                functionName: 'decimals'
              }
            ] as const)
          : ([] as const)
      )
    }),
    publicClientL2.multicall({
      allowFailure: false,
      contracts: strategies?.flatMap((strategy) =>
        isIonicToken(strategy.outputToken?.symbol) &&
        ionicTokensWithUnderlyingContractDataSelector?.[strategy.outputToken?.symbol]?.[2]
          ? ([
              {
                address: ionicTokensWithUnderlyingContractDataSelector?.[strategy.outputToken?.symbol]?.[2] as Address,
                abi: erc20Abi,
                functionName: 'balanceOf',
                args: [strategy.outputToken.address]
              },
              {
                address: ionicTokensWithUnderlyingContractDataSelector?.[strategy.outputToken?.symbol]?.[2] as Address,
                abi: erc20Abi,
                functionName: 'decimals'
              }
            ] as const)
          : ([] as const)
      )
    }),
    publicClientL2.multicall({
      allowFailure: false,
      contracts: strategies?.flatMap((strategy) =>
        hasNoOutputToken(strategy.address) && noOuputTokenContractDataSelector?.[strategy.address]
          ? ([
              {
                address: strategyToLimitsMapping[strategy.address] as Address,
                abi: strategyBaseTVLLimitAbi,
                functionName: 'sharesToUnderlyingView',
                args: [noOuputTokenContractDataSelector[strategy.address]?.[0]]
              }
            ] as const)
          : ([] as const)
      )
    })
  ]);

  // segment tokens underlying contract data
  const segmentTokenUnderlyingContractDataSelector = strategies.reduce(
    (acc, strategy) => {
      if (isSegmentToken(strategy.outputToken?.symbol)) {
        const idx = Object.keys(acc).length;

        acc[strategy.outputToken?.symbol] = segmentTokenUnderlyingContractData[idx] as number;
      }

      return acc;
    },
    {} as Record<keyof typeof segmentTokenToUnderlyingMapping, number>
  );

  // ionic tokens underlying contract data
  const ionicTokenUnderlyingContractDataSelector = strategies.reduce(
    (acc, strategy) => {
      if (isIonicToken(strategy.outputToken?.symbol)) {
        const idx = Object.keys(acc).length * 2;

        acc[strategy.outputToken?.symbol] = ionicTokenUnderlyingContractData.slice(idx, idx + 2) as [bigint, number];
      }

      return acc;
    },
    {} as Record<keyof typeof ionicTokenToUnderlyingMapping, [bigint, number]>
  );

  const noOuputTokenContractSharesToUnderlyingDataSelector = strategies.reduce(
    (acc, strategy) => {
      if (hasNoOutputToken(strategy.address)) {
        const idx = Object.keys(acc).length;

        acc[strategy.address] = noOuputTokenContractSharesToUnderlyingData[idx] as bigint;
      }

      return acc;
    },
    {} as Record<keyof typeof tokenToIdMapping, bigint>
  );

  const strategiesData = strategies?.map((strategy) => {
    const symbol = strategy.outputToken?.symbol;
    const address = strategy.outputToken?.address;

    if (
      isSegmentToken(symbol) &&
      segmentTokensWithUnderlyingContractDataSelector?.[symbol] &&
      segmentTokenUnderlyingContractDataSelector?.[symbol]
    ) {
      // `(totalCash + totalBorrows - totalReserves)` is multiplied by 1e18 to perform uint division
      // exchangeRate = (totalCash + totalBorrows - totalReserves) / totalSupply
      const [exchangeRateStored, totalSupply, balanceOf, decimals] =
        segmentTokensWithUnderlyingContractDataSelector[symbol]!;
      const underlyingDecimals = segmentTokenUnderlyingContractDataSelector[symbol]!;

      const totalSupplyInUnderlyingAsset = exchangeRateStored * totalSupply;
      const underlyingTicker = segmentTokenToUnderlyingMapping[symbol];
      const underlyingPrice = getPrice(underlyingTicker!);
      const depositAmount = CurrencyAmount.fromRawAmount(
        new Token(ChainId.BOB, address as Address, decimals, symbol, symbol),
        balanceOf
      );

      return {
        ...strategy,
        tvl: new Big(totalSupplyInUnderlyingAsset.toString())
          .mul(underlyingPrice)
          .div(1e18)
          .div(10 ** underlyingDecimals)
          .toNumber(),
        deposit: {
          token: {
            chainId: ChainId.BOB,
            address: address as Address,
            decimals,
            symbol,
            name: symbol,
            value: balanceOf.toString()
          },
          usd: new Big(depositAmount.toExact())
            .mul(underlyingPrice)
            .mul(exchangeRateStored.toString())
            .div(10 ** underlyingDecimals)
            .div(1e10)
            .toNumber()
        }
      };
    }

    if (
      isIonicToken(symbol) &&
      ionicTokensWithUnderlyingContractDataSelector?.[symbol] &&
      ionicTokenUnderlyingContractDataSelector?.[symbol]
    ) {
      const [balanceOf, decimals] = ionicTokensWithUnderlyingContractDataSelector[symbol]!;
      const [underlyingBalanceOf, underlyingDecimals] = ionicTokenUnderlyingContractDataSelector[symbol]!;

      const underlyingTicker = ionicTokenToUnderlyingMapping[symbol];
      const underlyingPrice = getPrice(underlyingTicker!);
      const depositAmount = CurrencyAmount.fromRawAmount(
        new Token(ChainId.BOB, address as Address, decimals, symbol, symbol),
        balanceOf
      );

      return {
        ...strategy,
        tvl: new Big(underlyingBalanceOf.toString())
          .mul(underlyingPrice)
          .div(10 ** underlyingDecimals)
          .toNumber(),
        deposit: {
          token: {
            chainId: ChainId.BOB,
            address: address as Address,
            decimals,
            symbol,
            name: symbol,
            value: balanceOf.toString()
          },
          usd: new Big(depositAmount.toExact()).div(5).mul(underlyingPrice).toNumber()
        }
      };
    }

    if (hasCGId(symbol) && tokensContractDataSelector?.[symbol]) {
      const [totalSupply, decimals, balanceOf] = tokensContractDataSelector[symbol]!;
      const ticker = tokenToIdMapping[symbol]!;
      const price = getPrice(ticker!);
      const depositAmount = CurrencyAmount.fromRawAmount(
        new Token(ChainId.BOB, address as Address, decimals, symbol, symbol),
        balanceOf
      );

      return {
        ...strategy,
        tvl: new Big(totalSupply.toString())
          .mul(price)
          .div(10 ** decimals)
          .toNumber(),
        deposit: {
          token: {
            chainId: ChainId.BOB,
            address: address as Address,
            decimals,
            symbol: ticker,
            name: ticker,
            value: balanceOf.toString()
          },
          usd: new Big(depositAmount.toExact()).mul(price).toNumber()
        }
      };
    }

    const strategyAddress = strategy.address;

    if (
      hasNoOutputToken(strategyAddress) &&
      noOuputTokenContractSharesToUnderlyingDataSelector?.[strategyAddress] &&
      noOuputTokenContractDataSelector?.[strategyAddress]
    ) {
      const totalSharesToUnderlying = noOuputTokenContractSharesToUnderlyingDataSelector[strategyAddress]!;
      const limitsContractAddress = strategyToLimitsMapping[strategyAddress]!;
      const [ticker, address, decimals] = limitsToUnderlyingMapping[limitsContractAddress]!;
      const [, balanceOf] = noOuputTokenContractDataSelector[strategyAddress]!;
      const price = getPrice(ticker!);
      const depositAmount = CurrencyAmount.fromRawAmount(
        // NOTE: ticker is incorrect but we will use it anyway because the strategy has no output token
        new Token(ChainId.BOB, address, decimals, ticker, ticker),
        balanceOf
      );

      return {
        ...strategy,
        tvl: new Big(totalSharesToUnderlying.toString())
          .mul(price)
          .div(10 ** decimals)
          .toNumber(),
        deposit: {
          token: {
            chainId: ChainId.BOB,
            address,
            decimals,
            symbol: ticker,
            name: ticker,
            value: balanceOf.toString()
          },
          usd: new Big(depositAmount.toExact()).mul(price).toNumber()
        }
      };
    }
  });

  return Response.json(
    { data: strategiesData },
    {
      status: 200,
      headers
    }
  );
}
