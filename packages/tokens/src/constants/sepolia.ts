import { ChainId } from '@gobob/chains';

import { USDC, USDT, WBTC } from './common';
import { WETH9 } from './weth';

export const sepoliaTokens = {
  weth: WETH9[ChainId.SEPOLIA],
  wbtc: WBTC[ChainId.SEPOLIA],
  usdc: USDC[ChainId.SEPOLIA],
  usdt: USDT[ChainId.SEPOLIA]
};
