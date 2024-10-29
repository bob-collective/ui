import { PropsWithChildren } from 'react';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useAccount } from '@gobob/wagmi';
import { Mock, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@gobob/react-query';
import request from 'graphql-request';

vi.mock(import('@gobob/wagmi'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useAccount: vi.fn()
  };
});

vi.mock('../useBridgeTokens', () => ({
  useBridgeTokens: vi.fn()
}));

vi.mock(import('graphql-request'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    default: vi.fn()
  };
});
import { useGetBridgeTransactions } from '../useGetBridgeTransactions';
import { useBridgeTokens } from '../useBridgeTokens';

const mockTokens = [
  { l1Token: { address: '0x123' }, l2Token: { address: '0x456' }, l1Currency: 'ETH', l2Currency: 'wETH' }
];

const createQueryClient = () => new QueryClient();

describe('useGetBridgeTransactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useAccount as Mock).mockReturnValue({ address: '0xabc' });
    (useBridgeTokens as Mock).mockReturnValue({ data: mockTokens });
  });

  it('should initialize in loading state', () => {
    (request as Mock).mockResolvedValue({ deposits: { eth: [], erc20: [] }, withdraws: { eth: [], erc20: [] } });
    const queryClient = createQueryClient();

    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useGetBridgeTransactions>>(
      () => useGetBridgeTransactions(),
      {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      }
    );

    expect(result.current.isLoading).toBe(true);
  });

  it('fetches and returns bridge transactions successfully', async () => {
    const mockDepositData = {
      deposits: {
        eth: [
          {
            from: '0xabc',
            to: '0xdef',
            transactionHash: '0xhash1',
            timestamp: 1660000000,
            amount: BigInt(1000000000),
            data: '0xdata'
          }
        ],
        erc20: []
      },
      withdraws: {
        eth: [],
        erc20: []
      }
    };

    (request as Mock).mockResolvedValue(mockDepositData);

    const queryClient = createQueryClient();

    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useGetBridgeTransactions>>(
      () => useGetBridgeTransactions(),
      {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0]?.transactionHash).toBe('0xhash1');
    expect(result.current.data[0]?.amount.toString()).toBe('1000000000');
  });
});
