import '@testing-library/jest-dom/vitest';

import { vi } from 'vitest';

vi.mock(import('viem'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    getAddress: vi.fn((address) => address)
  };
});
