import { describe, it, expect } from 'vitest';

import { WETH9 } from '../weth';

describe('WETH9 Snapshot', () => {
  it('should match snapshot for WETH9', () => {
    expect(WETH9).toMatchSnapshot();
  });
});
