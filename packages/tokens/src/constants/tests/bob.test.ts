import { describe, it, expect } from 'vitest';

import { bobTokens, bobSepoliaTokens, oldBobSepoliaTokens } from '../bob';

describe('Token Export Snapshots', () => {
  it('should match snapshot for bobTokens', () => {
    expect(bobTokens).toMatchSnapshot();
  });

  it('should match snapshot for bobSepoliaTokens', () => {
    expect(bobSepoliaTokens).toMatchSnapshot();
  });

  it('should match snapshot for oldBobSepoliaTokens', () => {
    expect(oldBobSepoliaTokens).toMatchSnapshot();
  });
});
