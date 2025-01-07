import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

enum PriceCurrency {
  USD = 'usd',
  BTC = 'btc',
  EUR = 'eur'
}

export enum CurrencyTickers {
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
  [CurrencyTickers.ALEX]: 'alexgo',
  [CurrencyTickers.DAI]: 'dai',
  [CurrencyTickers.DLLR]: 'sovryn-dollar',
  [CurrencyTickers.ESOV]: 'sovryn',
  [CurrencyTickers.ETH]: 'ethereum',
  [CurrencyTickers.RETH]: 'rocket-pool-eth',
  [CurrencyTickers.STONE]: 'stakestone-ether',
  [CurrencyTickers.TBTC]: 'tbtc',
  [CurrencyTickers.USDC]: 'usd-coin',
  [CurrencyTickers.USDT]: 'tether',
  [CurrencyTickers.WBTC]: 'wrapped-bitcoin',
  [CurrencyTickers.WSTETH]: 'wrapped-steth',
  [CurrencyTickers.BTC]: 'bitcoin',
  [CurrencyTickers['SolvBTC.BBN']]: 'solv-protocol-solvbtc-bbn',
  [CurrencyTickers.UNIBTC]: 'universal-btc',
  [CurrencyTickers.LBTC]: 'lombard-staked-btc'
};

type PricesData = Record<string, Record<PriceCurrency, number>>;

const availableVersusCurrencies = Object.values(PriceCurrency);

const getPrices = async (baseUrl: string, allCurrencies?: boolean) => {
  const vsCurrencies = allCurrencies ? availableVersusCurrencies.join(',') : PriceCurrency.USD;
  const ids = COINGECKO_IDS.join(',');

  const searchParams = new URLSearchParams({
    vs_currencies: vsCurrencies,
    ids
  });

  const url = `${baseUrl}?${searchParams.toString()}`;

  const response = await fetch(url);
  const json = await response.json();

  return json;
};

type UsePricesProps = { allCurrencies?: boolean; baseUrl?: string };

const usePrices = ({ baseUrl = '/api/prices', allCurrencies }: UsePricesProps = {}) => {
  const query = useQuery<PricesData>({
    queryFn: () => getPrices(baseUrl, allCurrencies),
    queryKey: ['prices'],
    staleTime: 30000,
    gcTime: 300000,
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  const getPrice = useCallback(
    (ticker: string, versusCurrency: PriceCurrency = PriceCurrency.USD) => {
      // TODO: price feed doesn't have BTC
      if (ticker === 'BTC') {
        ticker = 'tBTC';
      }

      const cgId = COINGECKO_ID_BY_CURRENCY_TICKER[ticker];

      return query.data?.[cgId!]?.[versusCurrency] || 0;
    },
    [query.data]
  );

  return { ...query, getPrice };
};

export { usePrices };
