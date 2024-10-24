// wBTC, tBTC, ETH, USDC, USDT, Dai
import { describe, it, expect } from 'vitest';
import { ChainId } from '@gobob/chains';

import { commonTokens, CommonToken } from '../common';

describe('Common Tokens for ChainId 60808', () => {
  const chainId = ChainId.BOB;

  it('should have wBTC (WBTC) for chain 60808', () => {
    const token = commonTokens[CommonToken.WBTC]?.[chainId];

    expect(token).toBeDefined();
    expect(token?.symbol).toBe(CommonToken.WBTC);
  });

  it('should have tBTC for chain 60808', () => {
    const token = commonTokens[CommonToken.tBTC]?.[chainId];

    expect(token).toBeDefined();
    expect(token?.symbol).toBe(CommonToken.tBTC);
  });

  it('should have USDC for chain 60808', () => {
    const token = commonTokens[CommonToken.USDC]?.[chainId];

    expect(token).toBeDefined();
    expect(token?.symbol).toBe(CommonToken.USDC);
  });

  it('should have USDT for chain 60808', () => {
    const token = commonTokens[CommonToken.USDT]?.[chainId];

    expect(token).toBeDefined();
    expect(token?.symbol).toBe(CommonToken.USDT);
  });

  it('should have Dai (DAI) for chain 60808', () => {
    const token = commonTokens[CommonToken.DAI]?.[chainId];

    expect(token).toBeDefined();
    expect(token?.symbol).toBe(CommonToken.DAI);
  });
});
