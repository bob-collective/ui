import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider, useQueryClient } from '@gobob/react-query';
import { useDisconnect, useAccountEffect } from '@gobob/wagmi';
import { PropsWithChildren } from 'react';

import { useLogout } from '../useLogout';
import { useGetUser } from '../useGetUser';

import { apiClient } from '@/utils';

vi.mock('@/utils', () => ({
  apiClient: {
    logout: vi.fn()
  }
}));

vi.mock(import('@gobob/react-query'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useQueryClient: vi.fn()
  };
});

vi.mock(import('@gobob/wagmi'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useDisconnect: vi.fn(),
    useAccountEffect: vi.fn()
  };
});

vi.mock('../useGetUser', () => ({
  useGetUser: vi.fn()
}));

const createQueryClient = () => new QueryClient();

describe('useLogout Hook', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let queryClientMock: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let disconnectMock: any;

  beforeEach(() => {
    queryClientMock = { removeQueries: vi.fn() };
    disconnectMock = vi.fn();
    (useQueryClient as Mock).mockReturnValue(queryClientMock);
    (useDisconnect as Mock).mockReturnValue({ disconnect: disconnectMock });
    (useGetUser as Mock).mockReturnValue({ data: { id: 1, name: 'Test User' } });
  });

  it('should call apiClient.logout, clear user query, and disconnect by default', async () => {
    const queryClient = createQueryClient();
    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useLogout>>(() => useLogout(), {
      wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    });

    await act(() => result.current.logout({ shouldDisconnect: true }));

    expect(apiClient.logout).toHaveBeenCalled();
    expect(queryClientMock.removeQueries).toHaveBeenCalledWith({ queryKey: ['user'] });
    expect(disconnectMock).toHaveBeenCalled();
  });

  it('should call apiClient.logout and clear user query without disconnecting', async () => {
    const queryClient = createQueryClient();
    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useLogout>>(() => useLogout(), {
      wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    });

    await act(() => result.current.logout({ shouldDisconnect: false }));
    expect(apiClient.logout).toHaveBeenCalled();
    expect(queryClientMock.removeQueries).toHaveBeenCalledWith({ queryKey: ['user'] });
    expect(disconnectMock).not.toHaveBeenCalled();
  });

  it.skip('should call logout with shouldDisconnect: false on account disconnect if user is logged in', async () => {
    (useAccountEffect as Mock).mockImplementation((options) => options.onDisconnect && options.onDisconnect());

    const queryClient = createQueryClient();

    renderHook<PropsWithChildren, ReturnType<typeof useLogout>>(() => useLogout(), {
      wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    });

    expect(apiClient.logout).toHaveBeenCalled();
    expect(queryClientMock.removeQueries).toHaveBeenCalledWith({ queryKey: ['user'] });
    expect(disconnectMock).not.toHaveBeenCalled();
  });
});
