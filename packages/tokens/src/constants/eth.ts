import { ChainId } from '@gobob/chains';

import { USDC, USDT, WBTC } from './common';
import { WETH9 } from './weth';

export const ethereumTokens = {
  weth: WETH9[ChainId.ETHEREUM],
  usdt: USDT[ChainId.ETHEREUM],
  usdc: USDC[ChainId.ETHEREUM],
  wbtc: WBTC[ChainId.ETHEREUM]
};
