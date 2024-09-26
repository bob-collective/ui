import '@testing-library/jest-dom/vitest';

import { vi } from 'vitest';

vi.mock(import('@gobob/currency'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    ERC20Token: actual.Token
  };
});
