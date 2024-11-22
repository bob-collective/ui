import { useQueryClient } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react-hooks';
import { PropsWithChildren } from 'react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { useAccountEffect, useDisconnect } from 'wagmi';

import { useGetUser } from '../useGetUser';
import { useLogout } from '../useLogout';

import { wrapper } from '@/test-utils';
import { apiClient } from '@/utils';

vi.mock('@/utils', () => ({
  apiClient: {
    logout: vi.fn()
  }
}));

vi.mock(import('@tanstack/react-query'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useQueryClient: vi.fn()
  };
});

vi.mock(import('wagmi'), async (importOriginal) => {
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
    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useLogout>>(() => useLogout(), {
      wrapper
    });

    await act(() => result.current.logout({ shouldDisconnect: true }));

    expect(apiClient.logout).toHaveBeenCalled();
    expect(queryClientMock.removeQueries).toHaveBeenCalledWith({ queryKey: ['user'] });
    expect(disconnectMock).toHaveBeenCalled();
  });

  it('should call apiClient.logout and clear user query without disconnecting', async () => {
    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useLogout>>(() => useLogout(), {
      wrapper
    });

    await act(() => result.current.logout({ shouldDisconnect: false }));
    expect(apiClient.logout).toHaveBeenCalled();
    expect(queryClientMock.removeQueries).toHaveBeenCalledWith({ queryKey: ['user'] });
    expect(disconnectMock).not.toHaveBeenCalled();
  });

  it.skip('should call logout with shouldDisconnect: false on account disconnect if user is logged in', async () => {
    (useAccountEffect as Mock).mockImplementation((options) => options.onDisconnect && options.onDisconnect());

    renderHook<PropsWithChildren, ReturnType<typeof useLogout>>(() => useLogout(), { wrapper });

    expect(apiClient.logout).toHaveBeenCalled();
    expect(queryClientMock.removeQueries).toHaveBeenCalledWith({ queryKey: ['user'] });
    expect(disconnectMock).not.toHaveBeenCalled();
  });
});
