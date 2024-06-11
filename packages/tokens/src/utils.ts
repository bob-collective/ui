import { ChainId } from '@gobob/chains';
import { Token } from '@gobob/currency';

import { tokens } from './tokens';

export function getTokensByChain(chainId?: ChainId): Token[] {
  if (!chainId) {
    return [];
  }

  const tokenMap = tokens[chainId];

  return Object.values(tokenMap);
}
