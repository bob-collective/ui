import { ChainId } from '@gobob/chains';

import { TBTC, USDC, USDT, WBTC } from './common';
import { WETH9 } from './weth';

export const bobTokens = {
  weth: WETH9[ChainId.BOB],
  wbtc: WBTC[ChainId.BOB],
  tbtc: TBTC[ChainId.BOB],
  usdc: USDC[ChainId.BOB],
  usdt: USDT[ChainId.BOB]
};

export const bobSepoliaTokens = {
  weth: WETH9[ChainId.BOB_SEPOLIA],
  wbtc: WBTC[ChainId.BOB_SEPOLIA],
  tbtc: TBTC[ChainId.BOB_SEPOLIA],
  usdc: USDC[ChainId.BOB_SEPOLIA],
  usdt: USDT[ChainId.BOB_SEPOLIA]
};
