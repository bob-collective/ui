import { describe, it, expect } from 'vitest';

import { sepoliaTokens } from '../sepolia';

describe('Sepolia Tokens Snapshot', () => {
  it('should match snapshot for sepoliaTokens', () => {
    expect(sepoliaTokens).toMatchSnapshot();
  });
});
