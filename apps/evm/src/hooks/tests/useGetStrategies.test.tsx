import { renderHook } from '@testing-library/react-hooks';
import { PropsWithChildren } from 'react';
import { describe, expect, it, Mock, vi } from 'vitest';

import { useGetStrategies } from '../useGetStrategies';

import { wrapper } from '@/test-utils';

vi.mock('../../lib/bob-sdk', () => ({
  gatewaySDK: {
    getStrategies: vi.fn()
  }
}));

describe('useGetStrategies hook', () => {
  beforeEach(() => {
    global.fetch = vi.fn(global.fetch);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call useQuery with correct params', async () => {
    const mockData = [{ id: 1, integration: { name: 'Strategy 1' } }];

    (global.fetch as Mock).mockResolvedValue({ json: () => mockData });

    const { result, waitFor } = renderHook<PropsWithChildren, ReturnType<typeof useGetStrategies>>(
      () => useGetStrategies(),
      { wrapper }
    );

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should handle error state correctly', async () => {
    const mockError = new Error('Failed to fetch');

    (global.fetch as Mock).mockRejectedValue(mockError);

    const { result, waitFor } = renderHook<PropsWithChildren, ReturnType<typeof useGetStrategies>>(
      () => useGetStrategies({ retry: false }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isError).toEqual(true));

    expect(result.current.error).toEqual(mockError);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should handle loading state correctly', () => {
    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useGetStrategies>>(() => useGetStrategies(), {
      wrapper
    });

    expect(result.current.isLoading).toBeTruthy();
  });
});
