import { ChainId } from '@gobob/chains';
import { USDT } from '@gobob/tokens';
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

// const ETH: Record<
//   ChainId.BOB | ChainId.ETHEREUM | ChainId.SEPOLIA | ChainId.BOB_SEPOLIA | ChainId.BASE_SEPOLIA,
//   RawToken
// > = {
//   [ChainId.ETHEREUM]: {
//     chainId: ChainId.ETHEREUM,
//     address: '0x0000000000000000000000000000000000000000',
//     name: 'Ether',
//     symbol: 'ETH',
//     decimals: 18,
//     logoUrl: 'https://ethereum-optimism.github.io/data/ETH/logo.svg',
//     apiId: 'ethereum'
//   },
//   [ChainId.BOB]: {
//     chainId: ChainId.BOB,
//     address: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
//     name: 'Ether',
//     symbol: 'ETH',
//     decimals: 18,
//     logoUrl: 'https://ethereum-optimism.github.io/data/ETH/logo.svg',
//     apiId: 'ethereum'
//   },
//   [ChainId.SEPOLIA]: {
//     chainId: ChainId.SEPOLIA,
//     address: '0x0000000000000000000000000000000000000000',
//     name: 'Ether',
//     symbol: 'ETH',
//     decimals: 18,
//     logoUrl: 'https://ethereum-optimism.github.io/data/ETH/logo.svg',
//     apiId: 'ethereum'
//   },
//   [ChainId.BOB_SEPOLIA]: {
//     chainId: ChainId.BOB_SEPOLIA,
//     address: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
//     name: 'Ether',
//     symbol: 'ETH',
//     decimals: 18,
//     logoUrl: 'https://ethereum-optimism.github.io/data/ETH/logo.svg',
//     apiId: 'ethereum'
//   },
//   [ChainId.BASE_SEPOLIA]: {
//     chainId: ChainId.BASE_SEPOLIA,
//     address: '0x0000000000000000000000000000000000000000',
//     name: 'Ether',
//     symbol: 'ETH',
//     decimals: 18,
//     logoUrl: 'https://ethereum-optimism.github.io/data/ETH/logo.svg',
//     apiId: 'ethereum'
//   }
// };

const bobAssets: RawToken[] = [
  {
    chainId: ChainId.BOB,
    address: '0x03c7054bcb39f7b2e5b2c7acb37583e32d70cfa3',
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    decimals: 8,
    logoUrl:
      'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
    apiId: 'wrapped-btc'
  },
  // {
  //   chainId: ChainId.BOB,
  //   address: USDC[ChainId.BOB].address,
  //   name: USDC[ChainId.BOB].name!,
  //   symbol: USDC[ChainId.BOB].symbol!,
  //   decimals: USDC[ChainId.BOB].decimals,
  //   logoUrl: 'https://ethereum-optimism.github.io/data/USDC/logo.png',
  //   apiId: 'usd-coin'
  // },
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

const baseSepoliaAssets: RawToken[] = [
  {
    chainId: ChainId.BASE_SEPOLIA,
    address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    logoUrl: 'https://ethereum-optimism.github.io/data/USDC/logo.png',
    apiId: 'usd-coin'
  }
];

export const tokens: RawToken[] = [...baseSepoliaAssets, ...bobAssets];
