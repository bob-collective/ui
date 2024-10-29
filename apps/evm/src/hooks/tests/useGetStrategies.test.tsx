import { QueryClient, QueryClientProvider } from '@gobob/react-query';
import { renderHook } from '@testing-library/react-hooks';
import { PropsWithChildren } from 'react';
import { describe, expect, it, Mock, vi } from 'vitest';

vi.mock('../../lib/bob-sdk', () => ({
  gatewaySDK: {
    getStrategies: vi.fn()
  }
}));

import { gatewaySDK } from '../../lib/bob-sdk';
import { useGetStrategies } from '../useGetStrategies';

const createQueryClient = () => new QueryClient();

describe('useGetStrategies hook', () => {
  afterEach((gatewaySDK.getStrategies as Mock).mockClear);

  it('should call useQuery with correct params', async () => {
    const mockData = [{ id: 1, integration: { name: 'Strategy 1' } }];

    (gatewaySDK.getStrategies as Mock).mockResolvedValue(mockData);

    const queryClient = createQueryClient();

    const { result, waitFor } = renderHook<PropsWithChildren, ReturnType<typeof useGetStrategies>>(
      () => useGetStrategies(),
      {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      }
    );

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(mockData);
    expect(gatewaySDK.getStrategies).toHaveBeenCalledWith();
    expect(gatewaySDK.getStrategies).toHaveBeenCalledTimes(1);
  });

  it('should handle error state correctly', async () => {
    const mockError = new Error('Failed to fetch');

    (gatewaySDK.getStrategies as Mock).mockRejectedValue(mockError);

    const queryClient = createQueryClient();

    const { result, waitFor } = renderHook<PropsWithChildren, ReturnType<typeof useGetStrategies>>(
      () => useGetStrategies({ retry: false }),
      {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      }
    );

    await waitFor(() => expect(result.current.isError).toEqual(true));

    expect(result.current.error).toEqual(mockError);
    expect(gatewaySDK.getStrategies).toHaveBeenCalledTimes(1);
  });

  it('should handle loading state correctly', () => {
    const queryClient = createQueryClient();

    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useGetStrategies>>(() => useGetStrategies(), {
      wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    });

    expect(result.current.isLoading).toBeTruthy();
  });
});
