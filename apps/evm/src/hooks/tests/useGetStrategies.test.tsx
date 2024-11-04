import { Wrapper } from '@/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import { PropsWithChildren } from 'react';
import { describe, expect, it, Mock, vi } from 'vitest';

import { gatewaySDK } from '../../lib/bob-sdk';
import { useGetStrategies } from '../useGetStrategies';

vi.mock('../../lib/bob-sdk', () => ({
  gatewaySDK: {
    getStrategies: vi.fn()
  }
}));

describe('useGetStrategies hook', () => {
  afterEach((gatewaySDK.getStrategies as Mock).mockClear);

  it('should call useQuery with correct params', async () => {
    const mockData = [{ id: 1, integration: { name: 'Strategy 1' } }];

    (gatewaySDK.getStrategies as Mock).mockResolvedValue(mockData);

    const { result, waitFor } = renderHook<PropsWithChildren, ReturnType<typeof useGetStrategies>>(
      () => useGetStrategies(),
      { wrapper: Wrapper }
    );

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(mockData);
    expect(gatewaySDK.getStrategies).toHaveBeenCalledWith();
    expect(gatewaySDK.getStrategies).toHaveBeenCalledTimes(1);
  });

  it('should handle error state correctly', async () => {
    const mockError = new Error('Failed to fetch');

    (gatewaySDK.getStrategies as Mock).mockRejectedValue(mockError);

    const { result, waitFor } = renderHook<PropsWithChildren, ReturnType<typeof useGetStrategies>>(
      () => useGetStrategies({ retry: false }),
      { wrapper: Wrapper }
    );

    await waitFor(() => expect(result.current.isError).toEqual(true));

    expect(result.current.error).toEqual(mockError);
    expect(gatewaySDK.getStrategies).toHaveBeenCalledTimes(1);
  });

  it('should handle loading state correctly', () => {
    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useGetStrategies>>(() => useGetStrategies(), {
      wrapper: Wrapper
    });

    expect(result.current.isLoading).toBeTruthy();
  });
});
