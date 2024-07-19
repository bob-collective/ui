import { ChainId } from '@gobob/chains';

import { bobSepoliaTokens, bobTokens } from './constants/bob';
import { sepoliaTokens } from './constants/sepolia';
import { ethereumTokens } from './constants/eth';

export const tokens = {
  [ChainId.ETHEREUM]: ethereumTokens,
  [ChainId.SEPOLIA]: sepoliaTokens,
  [ChainId.BOB]: bobTokens,
  [ChainId.BOB_SEPOLIA]: bobSepoliaTokens,
  [ChainId.ARBITRUM_ONE]: [],
  [ChainId.BASE]: [],
  [ChainId.OP]: [],
  [ChainId.BSC]: [],
  [ChainId.OPBNB]: [],
  [ChainId.POLYGON]: [],
  [ChainId.POLYGON_ZKEVM]: [],
  [ChainId.MOONBEAM]: [],
  [ChainId.BASE_SEPOLIA]: []
};
