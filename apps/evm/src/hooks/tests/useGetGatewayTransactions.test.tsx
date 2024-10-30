import { ChainId } from '@gobob/chains';
import { CurrencyAmount, Token } from '@gobob/currency';
import { QueryClient, QueryClientProvider } from '@gobob/react-query';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { PropsWithChildren } from 'react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { useAccount } from '@gobob/wagmi';

import { useFeatureFlag } from '../useFeatureFlag';
import { useGetGatewayTransactions } from '../useGetGatewayTransactions';

import { gatewaySDK } from '@/lib/bob-sdk';
import { esploraClient } from '@/utils';

vi.mock(import('@gobob/wagmi'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useAccount: vi.fn()
  };
});

vi.mock(import('../useFeatureFlag'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useFeatureFlag: vi.fn()
  };
});

vi.mock('@/lib/bob-sdk', () => ({
  gatewaySDK: {
    getOrders: vi.fn()
  }
}));

vi.mock('@/utils', () => ({
  esploraClient: {
    getLatestHeight: vi.fn()
  }
}));

const createQueryClient = () => new QueryClient();

beforeEach(vi.clearAllMocks);

describe('useGetGatewayTransactions', () => {
  it('should return no data when BTC Gateway feature is disabled', async () => {
    (useFeatureFlag as Mock).mockReturnValue(false);
    (useAccount as Mock).mockReturnValue({ address: '0x123' });

    const queryClient = createQueryClient();
    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useGetGatewayTransactions>>(
      () => useGetGatewayTransactions(),
      {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it('should fetch and format gateway transactions when BTC Gateway is enabled', async () => {
    (useFeatureFlag as Mock).mockReturnValue(true);
    (useAccount as Mock).mockReturnValue({ address: '0x123' });

    const mockOrders = [
      {
        getToken: () => ({
          chainId: ChainId.BOB,
          address: '0xTokenAddress',
          name: 'Mock Token',
          symbol: 'MTK',
          decimals: 18,
          logoURI: 'mock-logo.png'
        }),
        getTokenAmount: () => BigInt(1000000000000000000),
        txid: 'mockTxId',
        timestamp: 1698500000,
        txProofDifficultyFactor: 3,
        getStatus: async () => ({
          confirmed: false,
          pending: true,
          success: false,
          data: { confirmations: 1 }
        })
      }
    ];

    const mockHeight = 100;

    (gatewaySDK.getOrders as Mock).mockResolvedValue(mockOrders);
    (esploraClient.getLatestHeight as Mock).mockResolvedValue(mockHeight);

    const queryClient = createQueryClient();
    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useGetGatewayTransactions>>(
      () => useGetGatewayTransactions(),
      {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const expectedAmount = CurrencyAmount.fromRawAmount(
      new Token(ChainId.BOB, '0xTokenAddress', 18, 'MTK', 'Mock Token'),
      BigInt(1000000000000000000)
    );

    expect(result.current.data).toEqual([
      {
        amount: expectedAmount,
        btcTxId: 'mockTxId',
        date: new Date(1698500000 * 1000),
        confirmations: 1,
        totalConfirmations: 3,
        status: 'btc-confirmation',
        type: 1,
        isPending: true
      }
    ]);
  });
});
