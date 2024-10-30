import { renderHook } from '@testing-library/react-hooks';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChainId } from '@gobob/chains';
import { Ether } from '@gobob/currency';
import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@gobob/react-query';

import { useGasTokens } from '../useGasTokens';

vi.mock('../constants/assets', () => ({
  tokens: [
    { chainId: ChainId.ETHEREUM, decimals: 18, symbol: 'ETH' },
    { chainId: ChainId.ETHEREUM, decimals: 18, symbol: 'DAI' },
    { chainId: ChainId.SEPOLIA, decimals: 18, symbol: 'ETH' }
  ]
}));

vi.mock(import('@gobob/tokens'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    NATIVE: {
      ...actual['NATIVE'],
      [ChainId.ETHEREUM]: { decimals: 18 as const, name: 'Ether' as const, symbol: 'ETH' as const },
      [ChainId.SEPOLIA]: { decimals: 18 as const, name: 'Ether' as const, symbol: 'ETH' as const }
    }
  };
});

const createQueryClient = () => new QueryClient();

describe('useGasTokens', () => {
  beforeEach(vi.clearAllMocks);

  it('should return gas tokens for the specified chainId', async () => {
    const queryClient = createQueryClient();

    const { result, waitForNextUpdate } = renderHook<PropsWithChildren, ReturnType<typeof useGasTokens>>(
      () => useGasTokens(ChainId.ETHEREUM),
      {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      }
    );

    await waitForNextUpdate();

    expect(result.current.data).toEqual([
      {
        raw: {
          chainId: ChainId.ETHEREUM,
          address: '0x0000000000000000000000000000000000000000',
          apiId: 'ethereum',
          decimals: 18,
          symbol: 'ETH',
          name: 'Ether',
          logoUrl: 'https://ethereum-optimism.github.io/data/ETH/logo.svg'
        },
        currency: Ether.onChain(ChainId.ETHEREUM)
      }
    ]);
  });

  it('should return no gas tokens if chainId has no matching native token', async () => {
    const queryClient = createQueryClient();

    const { result, waitForNextUpdate } = renderHook<PropsWithChildren, ReturnType<typeof useGasTokens>>(
      () => useGasTokens(ChainId.SEPOLIA),
      {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      }
    );

    await waitForNextUpdate();

    expect(result.current.data).toEqual([
      {
        raw: {
          chainId: ChainId.SEPOLIA,
          address: '0x0000000000000000000000000000000000000000',
          apiId: 'ethereum',
          decimals: 18,
          symbol: 'ETH',
          name: 'Ether',
          logoUrl: 'https://ethereum-optimism.github.io/data/ETH/logo.svg'
        },
        currency: Ether.onChain(ChainId.SEPOLIA)
      }
    ]);
  });

  it('should return an empty array if no tokens match the chainId and symbol', async () => {
    const queryClient = createQueryClient();

    const { result, waitForNextUpdate } = renderHook<PropsWithChildren, ReturnType<typeof useGasTokens>>(
      () => useGasTokens(ChainId.POLYGON_ZKEVM),
      {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      }
    );

    await waitForNextUpdate();

    expect(result.current.data).toEqual([]);
  });
});
