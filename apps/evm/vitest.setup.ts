import { vi } from 'vitest';

vi.mock(import('viem'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    getAddress: vi.fn((address) => address)
  };
});

vi.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'string',
    style: {
      fontFamily: 'string'
    }
  }),
  Chakra_Petch: () => ({
    className: 'string',
    style: {
      fontFamily: 'string'
    }
  })
}));
