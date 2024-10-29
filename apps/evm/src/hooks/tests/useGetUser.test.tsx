import { PropsWithChildren } from 'react';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import { QueryClient, QueryClientProvider } from '@gobob/react-query';
import { useAccount } from '@gobob/wagmi';

import { useGetUser } from '../useGetUser';

import { apiClient } from '@/utils';

vi.mock('@gobob/wagmi', () => ({
  useAccount: vi.fn()
}));

vi.mock('@/utils', () => ({
  apiClient: {
    getMe: vi.fn()
  }
}));

const createQueryClient = () => new QueryClient();

describe('useGetUser', () => {
  const mockAddress = '0x123';

  beforeEach(vi.clearAllMocks);

  it('does not run query if no address is present', async () => {
    (useAccount as Mock).mockReturnValue({ address: null });

    const queryClient = createQueryClient();
    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useGetUser>>(() => useGetUser(), {
      wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isFetching).toBe(false);
  });

  it('fetches user data when address is present', async () => {
    const mockUserData = { name: 'John Doe', email: 'john@example.com' };

    (useAccount as Mock).mockReturnValue({ address: mockAddress });
    (apiClient.getMe as Mock).mockResolvedValue(mockUserData);

    const queryClient = createQueryClient();
    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useGetUser>>(() => useGetUser(), {
      wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockUserData);
  });

  it('returns undefined if fetching user data fails', async () => {
    (useAccount as Mock).mockReturnValue({ address: mockAddress });
    (apiClient.getMe as Mock).mockRejectedValue(new Error('Failed to fetch'));

    const queryClient = createQueryClient();
    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useGetUser>>(() => useGetUser(), {
      wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    });

    expect(result.current.data).toBeUndefined();
  });

  it('refetches data at the specified interval', async () => {
    (useAccount as Mock).mockReturnValue({ address: mockAddress });
    const mockUserData = { name: 'John Doe', email: 'john@example.com' };

    (apiClient.getMe as Mock).mockResolvedValue(mockUserData);

    const queryClient = createQueryClient();
    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useGetUser>>(() => useGetUser(), {
      wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockUserData);

    expect(apiClient.getMe).toHaveBeenCalledTimes(1);
  });
});
