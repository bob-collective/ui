import { describe, it, expect } from 'vitest';

import { ethereumTokens } from '../eth';

describe('Ethereum Tokens Snapshot', () => {
  it('should match snapshot for ethereumTokens', () => {
    expect(ethereumTokens).toMatchSnapshot();
  });
});
