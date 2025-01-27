import { renderHook, waitFor } from '@testing-library/react';
import { Mock, vi } from 'vitest';
import { useAccount } from 'wagmi';

import { useGetGatewayTransactions } from '../../transactions';

import { gatewaySDK } from '@/lib/bob-sdk';
import { wrapper } from '@/test-utils';
import { esploraClient } from '@/utils';

vi.mock(import('wagmi'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useAccount: vi.fn()
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

describe('useGetGatewayTransactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and processes gateway transactions successfully', async () => {
    (useAccount as Mock).mockReturnValue({ address: '0x123456789abcdef' });

    const mockOrders = [
      {
        getToken: () => ({
          chainId: 1,
          address: '0xTokenAddress',
          name: 'Token',
          symbol: 'TKN',
          decimals: 18,
          logoURI: 'https://example.com/token.png'
        }),
        getTokenAmount: () => '1000000000000000000',
        getStatus: async () => ({
          confirmed: true,
          pending: false,
          success: true,
          data: { confirmations: 3 }
        }),
        txid: '0xTransactionId',
        timestamp: 1660000000,
        txProofDifficultyFactor: 6,
        strategyAddress: null
      }
    ];
    const mockLatestHeight = 12345;

    (gatewaySDK.getOrders as Mock).mockResolvedValue(mockOrders);
    (esploraClient.getLatestHeight as Mock).mockResolvedValue(mockLatestHeight);

    const { result } = renderHook(() => useGetGatewayTransactions(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0]).toMatchObject({
      btcTxId: '0xTransactionId',
      status: 'l2-confirmation',
      type: 'gateway',
      subType: 'bridge',
      isPending: false
    });
  });
});
