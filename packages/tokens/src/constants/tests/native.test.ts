import { describe, it, expect } from 'vitest';

import { WNATIVE, NATIVE } from '../native';

describe('WNATIVE and NATIVE Token Snapshots', () => {
  it('should match snapshot for WNATIVE', () => {
    expect(WNATIVE).toMatchSnapshot();
  });

  it('should match snapshot for NATIVE', () => {
    expect(NATIVE).toMatchSnapshot();
  });
});
