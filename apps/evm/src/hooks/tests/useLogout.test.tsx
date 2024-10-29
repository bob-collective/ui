import { PropsWithChildren } from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@gobob/react-query';
import { useDisconnect, useAccountEffect } from '@gobob/wagmi';
import { Mock, vi } from 'vitest';

import { useLogout } from '../useLogout';
import { useGetUser } from '../useGetUser';

import { apiClient } from '@/utils';

vi.mock(import('@gobob/wagmi'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useDisconnect: vi.fn(),
    useAccountEffect: vi.fn()
  };
});

vi.mock('@/utils', () => ({
  apiClient: {
    logout: vi.fn()
  }
}));

vi.mock('../useGetUser', () => ({
  useGetUser: vi.fn()
}));

const createQueryClient = () => new QueryClient();

describe.skip('useLogout', () => {
  const mockUser = { id: 'user123' };
  const mockDisconnect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useGetUser as Mock).mockReturnValue({ data: mockUser });
    (useDisconnect as Mock).mockReturnValue({ disconnect: mockDisconnect });
    (useAccountEffect as Mock).mockImplementation(({ onDisconnect }) => {
      onDisconnect();
    });
  });

  it('logs out and disconnects successfully', async () => {
    const queryClient = createQueryClient();
    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useLogout>>(() => useLogout(), {
      wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    });

    await act(() => result.current.logout({}));

    expect(apiClient.logout).toHaveBeenCalled();
    // expect(mockDisconnect).toHaveBeenCalled();
  });

  it('logs out without disconnecting if shouldDisconnect is false', async () => {
    const queryClient = createQueryClient();
    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useLogout>>(() => useLogout(), {
      wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    });

    await act(() => result.current.logout({ shouldDisconnect: false }));

    expect(apiClient.logout).toHaveBeenCalled();
    // expect(mockDisconnect).not.toHaveBeenCalled();
  });

  it('calls logout on user disconnection trigger', async () => {
    const queryClient = createQueryClient();
    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useLogout>>(() => useLogout(), {
      wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    });

    await act(() => result.current.logout({ shouldDisconnect: false }));

    expect(apiClient.logout).toHaveBeenCalled();
    // expect(mockDisconnect).not.toHaveBeenCalled();
  });

  it('supports async logout with logoutAsync', async () => {
    const queryClient = createQueryClient();
    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useLogout>>(() => useLogout(), {
      wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    });

    await act(() => result.current.logoutAsync({}));

    expect(apiClient.logout).toHaveBeenCalled();
    // expect(mockDisconnect).toHaveBeenCalled();
  });
});
