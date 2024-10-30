import { ChainId } from '@gobob/chains';
import { Bitcoin, ERC20Token } from '@gobob/currency';
import tokenList from 'tokenlist';

export const CommonToken = {
  DAI: 'DAI',
  DLLR: 'DLLR',
  FBTC: 'FBTC',
  FRAX: 'FRAX',
  FXS: 'FXS',
  rETH: 'rETH',
  sFRAX: 'sFRAX',
  sfrxETH: 'sfrxETH',
  SOV: 'SOV',
  STONE: 'STONE',
  T: 'T',
  tBTC: 'tBTC',
  TRB: 'TRB',
  USDC: 'USDC',
  USDT: 'USDT',
  WBTC: 'WBTC',
  wstETH: 'wstETH'
} as const;

const commonTokenSet = new Set(Object.values(CommonToken) as string[]);

function isCommonToken(symbol: string): symbol is keyof typeof CommonToken {
  return commonTokenSet.has(symbol);
}

export const commonTokens = (tokenList.tokens as any[]).reduce<
  Partial<Record<keyof typeof CommonToken, Partial<Record<ChainId, ERC20Token>>>>
>(
  (acc, { symbol, chainId, address, decimals, name }) => {
    if (isCommonToken(symbol)) {
      if (acc[symbol] === undefined) acc[symbol] = {} as Record<ChainId, ERC20Token>;

      acc[symbol]![chainId as ChainId] = new ERC20Token(chainId, address as `0x${string}`, decimals, symbol, name);
    }

    return acc;
  },
  {} as Record<keyof typeof CommonToken, Record<ChainId, ERC20Token>>
);

export const USDC = commonTokens[CommonToken.USDC];

export const WBTC = commonTokens[CommonToken.WBTC];

export const TBTC = commonTokens[CommonToken.tBTC];

export const USDT_ETH = commonTokens[CommonToken.USDT]?.[ChainId.ETHEREUM];

export const USDT = commonTokens[CommonToken.USDT];

export const BITCOIN = new Bitcoin(8, 'BTC', 'Bitcoin');
