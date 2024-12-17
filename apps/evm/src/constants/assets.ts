import { ChainId } from '@gobob/chains';
import { TBTC, USDC, USDT, WBTC } from '@gobob/tokens';
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

export const ETH: Record<ChainId.BOB | ChainId.ETHEREUM | ChainId.SEPOLIA | ChainId.BOB_SEPOLIA, RawToken> = {
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
  }
};

export const wstETH: Record<ChainId.BOB | ChainId.ETHEREUM | ChainId.SEPOLIA, RawToken> = {
  [ChainId.ETHEREUM]: {
    chainId: ChainId.ETHEREUM,
    address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
    name: 'Wrapped liquid staked Ether 2.0',
    symbol: 'wstETH',
    decimals: 18,
    logoUrl: 'https://ethereum-optimism.github.io/data/wstETH/logo.svg',
    apiId: 'wrapped-steth'
  },
  [ChainId.BOB]: {
    chainId: ChainId.BOB,
    address: '0x85008aE6198BC91aC0735CB5497CF125ddAAc528',
    name: 'Wrapped liquid staked Ether 2.0',
    symbol: 'wstETH',
    decimals: 18,
    logoUrl: 'https://ethereum-optimism.github.io/data/wstETH/logo.svg',
    apiId: 'wrapped-steth'
  },
  [ChainId.SEPOLIA]: {
    chainId: ChainId.SEPOLIA,
    address: '0xDbcdAF513dc5Cc9F1289EC1Dd9D6Fe44AcfC289A',
    name: 'Wrapped liquid staked Ether 2.0',
    symbol: 'wstETH',
    decimals: 18,
    logoUrl: 'https://ethereum-optimism.github.io/data/wstETH/logo.svg',
    apiId: 'wrapped-steth'
  }
  // [ChainId.BOB_SEPOLIA]: {
  //   chainId: ChainId.BOB_SEPOLIA,
  //   address: '0x1f512b534F541424912AD78075d5A0a01C43C0CB',
  //   name: 'Wrapped liquid staked Ether 2.0',
  //   symbol: 'wstETH',
  //   decimals: 18,
  //   logoUrl: 'https://ethereum-optimism.github.io/data/wstETH/logo.svg',
  //   apiId: 'wrapped-steth'
  // },
};

const usdc: Partial<Record<ChainId.BOB | ChainId.ETHEREUM | ChainId.SEPOLIA | ChainId.BOB_SEPOLIA, RawToken>> = {
  ...(USDC?.[ChainId.ETHEREUM] && {
    [ChainId.ETHEREUM]: {
      chainId: ChainId.ETHEREUM,
      address: USDC[ChainId.ETHEREUM].address,
      name: USDC[ChainId.ETHEREUM].name!,
      symbol: USDC[ChainId.ETHEREUM].symbol,
      decimals: USDC[ChainId.ETHEREUM].decimals,
      logoUrl: 'https://ethereum-optimism.github.io/data/USDC/logo.png',
      apiId: 'usd-coin'
    }
  }),
  ...(USDC?.[ChainId.BOB] && {
    [ChainId.BOB]: {
      chainId: ChainId.BOB,
      address: USDC[ChainId.BOB].address,
      name: USDC[ChainId.BOB].name!,
      symbol: USDC[ChainId.BOB].symbol!,
      decimals: USDC[ChainId.BOB].decimals,
      logoUrl: 'https://ethereum-optimism.github.io/data/USDC/logo.png',
      apiId: 'usd-coin'
    }
  }),
  ...(USDC?.[ChainId.SEPOLIA] && {
    [ChainId.SEPOLIA]: {
      chainId: ChainId.SEPOLIA,
      address: USDC[ChainId.SEPOLIA].address,
      name: USDC[ChainId.SEPOLIA].name!,
      symbol: USDC[ChainId.SEPOLIA].symbol!,
      decimals: USDC[ChainId.SEPOLIA].decimals,
      logoUrl: 'https://ethereum-optimism.github.io/data/USDC/logo.png',
      apiId: 'usd-coin'
    }
  }),
  ...(USDC?.[ChainId.BOB_SEPOLIA] && {
    [ChainId.BOB_SEPOLIA]: {
      chainId: ChainId.BOB_SEPOLIA,
      address: USDC[ChainId.BOB_SEPOLIA].address,
      name: USDC[ChainId.BOB_SEPOLIA].name!,
      symbol: USDC[ChainId.BOB_SEPOLIA].symbol!,
      decimals: USDC[ChainId.BOB_SEPOLIA].decimals,
      logoUrl: 'https://ethereum-optimism.github.io/data/USDC/logo.png',
      apiId: 'usd-coin'
    }
  })
};

const ethereumAssets: RawToken[] = [
  ETH[ChainId.ETHEREUM],
  {
    chainId: ChainId.ETHEREUM,
    address: '0xe7c3755482d0dA522678Af05945062d4427e0923',
    name: 'ALEX',
    symbol: 'ALEX',
    decimals: 18,
    logoUrl:
      'https://images.ctfassets.net/frwmwlognk87/66AVnxb2drR9ofypuV3y2r/1f223e16a7236dfa0ea4b8e0259c35c8/alex.svg',
    apiId: 'alexgo',
    bridgeDisabled: true
  },
  {
    chainId: ChainId.ETHEREUM,
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
    logoUrl: 'https://ethereum-optimism.github.io/data/DAI/logo.svg',
    apiId: 'dai'
  },
  ...(USDT?.[ChainId.ETHEREUM]
    ? [
        {
          chainId: ChainId.ETHEREUM,
          address: USDT[ChainId.ETHEREUM].address,
          name: USDT[ChainId.ETHEREUM].name!,
          symbol: USDT[ChainId.ETHEREUM].symbol,
          decimals: USDT[ChainId.ETHEREUM].decimals,
          logoUrl: 'https://ethereum-optimism.github.io/data/USDT/logo.png',
          apiId: 'tether'
        }
      ]
    : []),
  ...(WBTC?.[ChainId.ETHEREUM]
    ? [
        {
          chainId: ChainId.ETHEREUM,
          address: WBTC[ChainId.ETHEREUM].address,
          name: WBTC[ChainId.ETHEREUM].name!,
          symbol: WBTC[ChainId.ETHEREUM].symbol,
          decimals: WBTC[ChainId.ETHEREUM].decimals,
          logoUrl:
            'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
          apiId: 'wrapped-btc'
        }
      ]
    : []),
  {
    chainId: ChainId.ETHEREUM,
    address: '0xae78736Cd615f374D3085123A210448E74Fc6393',
    name: 'Rocket Pool ETH',
    symbol: 'rETH',
    decimals: 18,
    logoUrl: 'https://ethereum-optimism.github.io/data/rETH/logo.svg',
    apiId: 'rocket-pool-eth'
  },
  ...(TBTC?.[ChainId.ETHEREUM]
    ? [
        {
          chainId: ChainId.ETHEREUM,
          address: TBTC[ChainId.ETHEREUM].address,
          name: TBTC[ChainId.ETHEREUM].name!,
          symbol: TBTC[ChainId.ETHEREUM].symbol,
          decimals: TBTC[ChainId.ETHEREUM].decimals,
          logoUrl: 'https://ethereum-optimism.github.io/data/tBTC/logo.svg',
          apiId: 'tbtc'
        }
      ]
    : []),
  {
    chainId: ChainId.ETHEREUM,
    address: '0xbdab72602e9AD40FC6a6852CAf43258113B8F7a5',
    name: 'eSOV',
    symbol: 'eSOV',
    decimals: 18,
    logoUrl: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/1407.png',
    apiId: 'sovryn'
  },
  {
    chainId: ChainId.ETHEREUM,
    address: '0x8236a87084f8b84306f72007f36f2618a5634494',
    name: 'LBTC',
    symbol: 'LBTC',
    decimals: 8,
    logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/33652.png',
    apiId: 'lombard-staked-btc'
  },
  {
    chainId: ChainId.ETHEREUM,
    address: '0x7122985656e38BDC0302Db86685bb972b145bD3C',
    name: 'StakeStone Ether',
    symbol: 'STONE',
    decimals: 18,
    logoUrl: 'https://storage.googleapis.com/ks-setting-1d682dca/dee351e5-ff61-4a8f-994d-82f3078119661696785945490.png',
    apiId: 'stakestone-ether'
  },
  {
    chainId: ChainId.ETHEREUM,
    address: '0xbdBb63F938c8961AF31eaD3deBa5C96e6A323DD1',
    name: 'Sovryn Dollar',
    symbol: 'DLLR',
    decimals: 18,
    logoUrl: 'https://assets.coingecko.com/coins/images/30947/standard/sovryn_dllr.jpg',
    apiId: 'sovryn-dollar'
  },
  ...(usdc[ChainId.ETHEREUM] ? [usdc[ChainId.ETHEREUM]] : []),
  wstETH[ChainId.ETHEREUM],
  {
    chainId: ChainId.ETHEREUM,
    address: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
    name: 'Frax',
    symbol: 'FRAX',
    decimals: 18,
    logoUrl: 'https://assets.coingecko.com/coins/images/13422/standard/FRAX_icon.png',
    apiId: 'frax'
  },
  {
    chainId: ChainId.ETHEREUM,
    address: '0xA663B02CF0a4b149d2aD41910CB81e23e1c41c32',
    name: 'Staked FRAX',
    symbol: 'sFRAX',
    decimals: 18,
    logoUrl: 'https://assets.coingecko.com/coins/images/35383/standard/sfrax.png',
    apiId: 'staked-frax'
  },
  {
    chainId: ChainId.ETHEREUM,
    address: '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0',
    name: 'Frax Share',
    symbol: 'FXS',
    decimals: 18,
    logoUrl: 'https://assets.coingecko.com/coins/images/13423/standard/Frax_Shares_icon.png',
    apiId: 'frax-share'
  },
  {
    chainId: ChainId.ETHEREUM,
    address: '0xac3E018457B222d93114458476f3E3416Abbe38F',
    name: 'Staked Frax Ether',
    symbol: 'sfrxETH',
    decimals: 18,
    logoUrl: 'https://assets.coingecko.com/coins/images/28285/standard/sfrxETH_icon.png',
    apiId: 'staked-frax-ether'
  },
  {
    chainId: ChainId.ETHEREUM,
    address: '0x88dF592F8eb5D7Bd38bFeF7dEb0fBc02cf3778a0',
    name: 'Tellor Tributes',
    symbol: 'TRB',
    decimals: 18,
    logoUrl: 'https://assets.coingecko.com/coins/images/9644/standard/Blk_icon_current.png',
    apiId: 'tellor-tributes'
  },
  {
    chainId: ChainId.ETHEREUM,
    address: '0xCdF7028ceAB81fA0C6971208e83fa7872994beE5',
    name: 'Threshold Network Token',
    symbol: 'T',
    decimals: 18,
    logoUrl: 'https://assets.coingecko.com/coins/images/22228/standard/nFPNiSbL_400x400.jpg',
    apiId: 'threshold-network-token'
  }
];

const sepoliaAssets: RawToken[] = [
  ETH[ChainId.SEPOLIA],
  ...(USDT?.[ChainId.SEPOLIA]
    ? [
        {
          chainId: ChainId.SEPOLIA,
          address: USDT[ChainId.SEPOLIA].address,
          name: USDT[ChainId.SEPOLIA].name!,
          symbol: USDT[ChainId.SEPOLIA].symbol!,
          decimals: USDT[ChainId.SEPOLIA].decimals,
          logoUrl: 'https://ethereum-optimism.github.io/data/USDT/logo.png',
          apiId: 'tether'
        }
      ]
    : []),
  ...(TBTC?.[ChainId.SEPOLIA]
    ? [
        {
          chainId: ChainId.SEPOLIA,
          address: TBTC[ChainId.SEPOLIA].address,
          name: TBTC[ChainId.SEPOLIA].name!,
          symbol: TBTC[ChainId.SEPOLIA].symbol!,
          decimals: TBTC[ChainId.SEPOLIA].decimals,
          logoUrl: 'https://ethereum-optimism.github.io/data/tBTC/logo.svg',
          apiId: 'tbtc'
        }
      ]
    : []),
  ...(usdc[ChainId.SEPOLIA] ? [usdc[ChainId.SEPOLIA]] : []),
  wstETH[ChainId.SEPOLIA]
];

const bobAssets: RawToken[] = [
  ETH[ChainId.BOB],
  {
    chainId: ChainId.BOB,
    address: '0xa669e059fDcbDFC532A2edd658eb2922799EEDb8',
    name: 'ALEX',
    symbol: 'ALEX',
    decimals: 18,
    logoUrl:
      'https://images.ctfassets.net/frwmwlognk87/66AVnxb2drR9ofypuV3y2r/1f223e16a7236dfa0ea4b8e0259c35c8/alex.svg',
    apiId: 'alexgo',
    bridgeDisabled: true
  },
  {
    chainId: ChainId.BOB,
    address: '0x6c851F501a3F24E29A8E39a29591cddf09369080',
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
    logoUrl: 'https://ethereum-optimism.github.io/data/DAI/logo.svg',
    apiId: 'dai'
  },
  ...(USDT?.[ChainId.BOB]
    ? [
        {
          chainId: ChainId.BOB,
          address: USDT[ChainId.BOB].address,
          name: USDT[ChainId.BOB].name!,
          symbol: USDT[ChainId.BOB].symbol,
          decimals: USDT[ChainId.BOB].decimals,
          logoUrl: 'https://ethereum-optimism.github.io/data/USDT/logo.png',
          apiId: 'tether'
        }
      ]
    : []),
  ...(WBTC?.[ChainId.BOB]
    ? [
        {
          chainId: ChainId.BOB,
          address: WBTC[ChainId.BOB].address,
          name: WBTC[ChainId.BOB].name!,
          symbol: WBTC[ChainId.BOB].symbol,
          decimals: WBTC[ChainId.BOB].decimals,
          logoUrl:
            'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
          apiId: 'wrapped-btc'
        }
      ]
    : []),
  {
    chainId: ChainId.BOB,
    address: '0xB5686c4f60904Ec2BDA6277d6FE1F7cAa8D1b41a',
    name: 'Rocket Pool ETH',
    symbol: 'rETH',
    decimals: 18,
    logoUrl: 'https://ethereum-optimism.github.io/data/rETH/logo.svg',
    apiId: 'rocket-pool-eth'
  },
  ...(TBTC?.[ChainId.BOB]
    ? [
        {
          chainId: ChainId.BOB,
          address: TBTC[ChainId.BOB].address,
          name: TBTC[ChainId.BOB].name!,
          symbol: TBTC[ChainId.BOB].symbol,
          decimals: TBTC[ChainId.BOB].decimals,
          logoUrl: 'https://ethereum-optimism.github.io/data/tBTC/logo.svg',
          apiId: 'tbtc'
        }
      ]
    : []),
  {
    chainId: ChainId.BOB,
    address: '0xba20a5e63eeEFfFA6fD365E7e540628F8fC61474',
    name: 'eSOV',
    symbol: 'eSOV',
    decimals: 18,
    logoUrl: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/1407.png',
    apiId: 'sovryn'
  },
  {
    chainId: ChainId.BOB,
    address: '0x1010101010101010101010101010101010101010',
    name: 'LBTC',
    symbol: 'LBTC',
    decimals: 8,
    logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/33652.png',
    apiId: 'lombard-staked-btc'
  },
  {
    chainId: ChainId.BOB,
    address: '0x96147A9Ae9a42d7Da551fD2322ca15B71032F342',
    name: 'StakeStone Ether',
    symbol: 'STONE',
    decimals: 18,
    logoUrl: 'https://storage.googleapis.com/ks-setting-1d682dca/dee351e5-ff61-4a8f-994d-82f3078119661696785945490.png',
    apiId: 'stakestone-ether'
  },
  {
    chainId: ChainId.BOB,
    address: '0xf3107eEC1e6F067552C035FD87199e1A5169CB20',
    name: 'Sovryn Dollar',
    symbol: 'DLLR',
    decimals: 18,
    logoUrl: 'https://assets.coingecko.com/coins/images/30947/standard/sovryn_dllr.jpg?1696529786',
    apiId: 'sovryn-dollar'
  },
  wstETH[ChainId.BOB],
  ...(usdc?.[ChainId.BOB] ? [usdc?.[ChainId.BOB]] : []),
  {
    chainId: ChainId.BOB,
    address: '0xc4a20a608616F18aA631316eEDa9Fb62d089361e',
    name: 'Frax',
    symbol: 'FRAX',
    decimals: 18,
    logoUrl: 'https://assets.coingecko.com/coins/images/13422/standard/FRAX_icon.png',
    apiId: 'frax'
  },
  {
    chainId: ChainId.BOB,
    address: '0xb7eae04B995B3b365040dEE99795112ADD43afa0',
    name: 'Staked FRAX',
    symbol: 'sFRAX',
    decimals: 18,
    logoUrl: 'https://assets.coingecko.com/coins/images/35383/standard/sfrax.png',
    apiId: 'staked-frax'
  },
  {
    chainId: ChainId.BOB,
    address: '0x15e35B19AD29C512103EaABb55154Ef0Ee6ca661',
    name: 'Frax Share',
    symbol: 'FXS',
    decimals: 18,
    logoUrl: 'https://assets.coingecko.com/coins/images/13423/standard/Frax_Shares_icon.png',
    apiId: 'frax-share'
  },
  {
    chainId: ChainId.BOB,
    address: '0x249d2952D1C678843e7cD7bF654EfCeC52f2F9E8',
    name: 'Staked Frax Ether',
    symbol: 'sfrxETH',
    decimals: 18,
    logoUrl: 'https://assets.coingecko.com/coins/images/28285/standard/sfrxETH_icon.png',
    apiId: 'staked-frax-ether'
  },
  {
    chainId: ChainId.BOB,
    address: '0x665060707c3Ea3c31b3eaBaD7F409072446E1D50',
    name: 'Tellor Tributes',
    symbol: 'TRB',
    decimals: 18,
    logoUrl: 'https://assets.coingecko.com/coins/images/9644/standard/Blk_icon_current.png',
    apiId: 'tellor-tributes'
  },
  {
    chainId: ChainId.BOB,
    address: '0xF14e82E192a36Df7d09Fe726F6ECF70310f73438',
    name: 'Threshold Network Token',
    symbol: 'T',
    decimals: 18,
    logoUrl: 'https://assets.coingecko.com/coins/images/22228/standard/nFPNiSbL_400x400.jpg',
    apiId: 'threshold-network-token'
  }
];

const bobSepoliaAssets: RawToken[] = [
  ETH[ChainId.BOB_SEPOLIA],
  ...(usdc[ChainId.BOB_SEPOLIA] ? [usdc[ChainId.BOB_SEPOLIA]] : []),
  ...(TBTC?.[ChainId.BOB_SEPOLIA]
    ? [
        {
          chainId: ChainId.BOB_SEPOLIA,
          address: TBTC[ChainId.BOB_SEPOLIA].address,
          name: TBTC[ChainId.BOB_SEPOLIA].name!,
          symbol: TBTC[ChainId.BOB_SEPOLIA].symbol!,
          decimals: TBTC[ChainId.BOB_SEPOLIA].decimals,
          logoUrl: 'https://ethereum-optimism.github.io/data/tBTC/logo.svg',
          apiId: 'tbtc'
        }
      ]
    : [])
  // wstETH[ChainId.BOB_SEPOLIA]
];

export const tokens: RawToken[] = [...ethereumAssets, ...sepoliaAssets, ...bobAssets, ...bobSepoliaAssets];
