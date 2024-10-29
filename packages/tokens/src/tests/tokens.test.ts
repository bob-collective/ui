import { describe, it, expect } from 'vitest';

import { tokens } from '../tokens'; // Adjust the path as necessary

describe('Tokens Snapshot', () => {
  it('should match snapshot for tokens', () => {
    expect(tokens).toMatchSnapshot();
  });
});
