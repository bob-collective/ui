import { ChainId } from '@gobob/chains';
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

const ETH: Record<
  ChainId.BOB | ChainId.ETHEREUM | ChainId.SEPOLIA | ChainId.BOB_SEPOLIA | ChainId.BASE_SEPOLIA,
  RawToken
> = {
  [ChainId.ETHEREUM]: {
    chainId: ChainId.ETHEREUM,
    address: '0x0000000000000000000000000000000000000000',
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    logoUrl: 'https://ethereum-optimism.github.io/data/ETH/logo.svg',
    apiId: 'ethereum'
  },
  [ChainId.BOB]: {
    chainId: ChainId.BOB,
    address: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    logoUrl: 'https://ethereum-optimism.github.io/data/ETH/logo.svg',
    apiId: 'ethereum'
  },
  [ChainId.SEPOLIA]: {
    chainId: ChainId.SEPOLIA,
    address: '0x0000000000000000000000000000000000000000',
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    logoUrl: 'https://ethereum-optimism.github.io/data/ETH/logo.svg',
    apiId: 'ethereum'
  },
  [ChainId.BOB_SEPOLIA]: {
    chainId: ChainId.BOB_SEPOLIA,
    address: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    logoUrl: 'https://ethereum-optimism.github.io/data/ETH/logo.svg',
    apiId: 'ethereum'
  },
  [ChainId.BASE_SEPOLIA]: {
    chainId: ChainId.BASE_SEPOLIA,
    address: '0x0000000000000000000000000000000000000000',
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    logoUrl: 'https://ethereum-optimism.github.io/data/ETH/logo.svg',
    apiId: 'ethereum'
  }
};

const baseSepoliaAssets: RawToken[] = [
  ETH[ChainId.BASE_SEPOLIA],
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

export const tokens: RawToken[] = [...baseSepoliaAssets];
