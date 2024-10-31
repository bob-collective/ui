import { describe, it, expect } from 'vitest';
import { ChainId } from '@gobob/chains';

import { commonTokens, CommonToken, WBTC, USDC, TBTC, USDT } from '../common';

describe('Common Tokens', () => {
  it('should have wBTC (WBTC) for chain ids 1 & 60808', () => {
    const tokenOnEthereum = commonTokens[CommonToken.WBTC]?.[ChainId.ETHEREUM];

    expect(tokenOnEthereum).toBeDefined();
    expect(tokenOnEthereum?.symbol).toBe(CommonToken.WBTC);

    const tokenOnBOB = commonTokens[CommonToken.WBTC]?.[ChainId.BOB];

    expect(tokenOnBOB).toBeDefined();
    expect(tokenOnBOB?.symbol).toBe(CommonToken.WBTC);
  });

  it('should have tBTC for chain ids 1 & 60808', () => {
    const tokenOnEthereum = commonTokens[CommonToken.tBTC]?.[ChainId.ETHEREUM];

    expect(tokenOnEthereum).toBeDefined();
    expect(tokenOnEthereum?.symbol).toBe(CommonToken.tBTC);

    const tokenOnBOB = commonTokens[CommonToken.tBTC]?.[ChainId.BOB];

    expect(tokenOnBOB).toBeDefined();
    expect(tokenOnBOB?.symbol).toBe(CommonToken.tBTC);
  });

  it('should have USDC for chain ids 1 & 60808', () => {
    const tokenOnEthereum = commonTokens[CommonToken.USDC]?.[ChainId.ETHEREUM];

    expect(tokenOnEthereum).toBeDefined();
    expect(tokenOnEthereum?.symbol).toBe(CommonToken.USDC);

    const tokenOnBOB = commonTokens[CommonToken.USDC]?.[ChainId.BOB];

    expect(tokenOnBOB).toBeDefined();
    expect(tokenOnBOB?.symbol).toBe(CommonToken.USDC);
  });

  it('should have USDT for chain ids 1 & 60808', () => {
    const tokenOnEthereum = commonTokens[CommonToken.USDT]?.[ChainId.ETHEREUM];

    expect(tokenOnEthereum).toBeDefined();
    expect(tokenOnEthereum?.symbol).toBe(CommonToken.USDT);

    const tokenOnBOB = commonTokens[CommonToken.USDT]?.[ChainId.BOB];

    expect(tokenOnBOB).toBeDefined();
    expect(tokenOnBOB?.symbol).toBe(CommonToken.USDT);
  });

  it('should have Dai (DAI) for chain ids 1 & 60808', () => {
    const tokenOnEthereum = commonTokens[CommonToken.DAI]?.[ChainId.ETHEREUM];

    expect(tokenOnEthereum).toBeDefined();
    expect(tokenOnEthereum?.symbol).toBe(CommonToken.DAI);

    const tokenOnBOB = commonTokens[CommonToken.DAI]?.[ChainId.BOB];

    expect(tokenOnBOB).toBeDefined();
    expect(tokenOnBOB?.symbol).toBe(CommonToken.DAI);
  });

  it('should match snapshot for WBTC', () => {
    expect(WBTC).toMatchSnapshot();
  });

  it('should match snapshot for USDC', () => {
    expect(USDC).toMatchSnapshot();
  });

  it('should match snapshot for TBTC', () => {
    expect(TBTC).toMatchSnapshot();
  });

  it('should match snapshot for USDT', () => {
    expect(USDT).toMatchSnapshot();
  });
});
