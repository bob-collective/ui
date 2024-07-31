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

export const oldBobSepoliaTokens = {
  weth: WETH9[ChainId.OLD_BOB_SEPOLIA],
  wbtc: WBTC[ChainId.OLD_BOB_SEPOLIA],
  tbtc: TBTC[ChainId.OLD_BOB_SEPOLIA],
  usdc: USDC[ChainId.OLD_BOB_SEPOLIA],
  usdt: USDT[ChainId.OLD_BOB_SEPOLIA]
};
