import { describe, it, expect } from 'vitest';

import { tokens } from '../tokens';

describe('Tokens Snapshot', () => {
  it('should match snapshot for tokens', () => {
    expect(tokens).toMatchSnapshot();
  });
});
