import { ChainId } from '@gobob/chains';
import { Bitcoin, ERC20Token } from '@gobob/currency';

export const USDC_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  6,
  'USDC',
  'USD Coin'
);

export const USDC = {
  [ChainId.ETHEREUM]: USDC_ETH,
  [ChainId.SEPOLIA]: new ERC20Token(
    ChainId.SEPOLIA,
    '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    6,
    'USDC',
    'USD Coin'
  ),
  [ChainId.BOB]: new ERC20Token(ChainId.BOB, '0xe75D0fB2C24A55cA1e3F96781a2bCC7bdba058F0', 6, 'USDC', 'USD Coin'),
  [ChainId.BOB_SEPOLIA]: new ERC20Token(
    ChainId.BOB_SEPOLIA,
    '0xdD796dbad8c4c6Ccd5C8cA9a6B1727CbEcc682AB',
    6,
    'USDC',
    'USD Coin'
  )
};

export const WBTC_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  8,
  'WBTC',
  'Wrapped BTC'
);

export const WBTC = {
  [ChainId.ETHEREUM]: WBTC_ETH,
  [ChainId.SEPOLIA]: new ERC20Token(
    ChainId.SEPOLIA,
    '0x2347e58e68ff44c6ce4860bb7004ea531d357244',
    8,
    'WBTC',
    'Wrapped BTC'
  ),
  [ChainId.BOB]: new ERC20Token(ChainId.BOB, '0x03c7054bcb39f7b2e5b2c7acb37583e32d70cfa3', 8, 'WBTC', 'Wrapped BTC'),
  [ChainId.BOB_SEPOLIA]: new ERC20Token(
    ChainId.BOB_SEPOLIA,
    '0x2868d708e442A6a940670d26100036d426F1e16b',
    8,
    'WBTC',
    'Wrapped BTC'
  )
};

export const TBTC_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0x18084fbA666a33d37592fA2633fD49a74DD93a88',
  18,
  'tBTC',
  'tBTC v2'
);

export const TBTC = {
  [ChainId.ETHEREUM]: TBTC_ETH,
  [ChainId.SEPOLIA]: new ERC20Token(
    ChainId.SEPOLIA,
    '0x517f2982701695D4E52f1ECFBEf3ba31Df470161',
    18,
    'tBTC',
    'tBTC v2'
  ),
  [ChainId.BOB]: new ERC20Token(ChainId.BOB, '0xBBa2eF945D523C4e2608C9E1214C2Cc64D4fc2e2', 18, 'tBTC', 'tBTC v2'),
  [ChainId.BOB_SEPOLIA]: new ERC20Token(
    ChainId.BOB_SEPOLIA,
    '0x43a4e4E277aE3477c4E8A058640951FCb98CcC8B',
    18,
    'tBTC',
    'tBTC v2'
  )
};

export const USDT_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  6,
  'USDT',
  'Tether USD',
  'https://tether.to/'
);

export const USDT = {
  [ChainId.ETHEREUM]: USDT_ETH,
  [ChainId.SEPOLIA]: new ERC20Token(
    ChainId.SEPOLIA,
    '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06',
    6,
    'USDT',
    'Tether USD'
  ),
  [ChainId.BOB]: new ERC20Token(ChainId.BOB, '0x05d032ac25d322df992303dca074ee7392c117b9', 6, 'USDT', 'Tether USD'),
  [ChainId.BOB_SEPOLIA]: new ERC20Token(
    ChainId.BOB_SEPOLIA,
    '0x38F715c449b0e24B21Fa15E6D34286fb19d15D03',
    6,
    'USDT',
    'Tether USD'
  )
};

export const BITCOIN = new Bitcoin(8, 'BTC', 'Bitcoin');
