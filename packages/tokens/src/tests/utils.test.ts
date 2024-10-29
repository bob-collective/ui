import { describe, it, expect } from 'vitest';
import { ChainId } from '@gobob/chains';

import { getTokensByChain } from '../utils';
import { tokens } from '../tokens';

describe('getTokensByChain', () => {
  it('should return tokens for a valid ChainId', () => {
    const result = getTokensByChain(ChainId.ETHEREUM);
    const expectedTokens = Object.values(tokens[ChainId.ETHEREUM]).filter(Boolean);

    expect(result).toEqual(expectedTokens);
  });

  it('should return an empty array for an invalid ChainId', () => {
    const result = getTokensByChain(ChainId.POLYGON_ZKEVM);

    expect(result).toEqual([]);
  });

  it('should return an empty array when no chainId is provided', () => {
    const result = getTokensByChain();

    expect(result).toEqual([]);
  });
});
