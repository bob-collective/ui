import { ChainId } from '@gobob/chains';
import { USDT, WBTC } from '@gobob/tokens';
import { Address } from 'viem';

export type RawToken = {
  chainId: ChainId;
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  logoUrl: string;
  apiId: string;
  bridgeDisabled?: boolean;
};

if (!WBTC?.[ChainId.BOB] || !USDT?.[ChainId.BOB]) {
  throw new Error('WBTC or USDT missing');
}

const bobAssets: RawToken[] = [
  {
    chainId: ChainId.BOB,
    address: WBTC[ChainId.BOB].address,
    name: WBTC[ChainId.BOB].name!,
    symbol: WBTC[ChainId.BOB].symbol,
    decimals: WBTC[ChainId.BOB].decimals,
    logoUrl:
      'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
    apiId: 'wrapped-btc'
  },
  {
    chainId: ChainId.BOB,
    address: USDT[ChainId.BOB].address,
    name: USDT[ChainId.BOB].name!,
    symbol: USDT[ChainId.BOB].symbol,
    decimals: USDT[ChainId.BOB].decimals,
    logoUrl: 'https://ethereum-optimism.github.io/data/USDT/logo.png',
    apiId: 'tether'
  }
];

export const tokens: RawToken[] = [...bobAssets];
