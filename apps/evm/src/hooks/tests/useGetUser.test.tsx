import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { PropsWithChildren } from 'react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { useAccount } from 'wagmi';

import { useGetUser } from '../useGetUser';

import { wrapper } from '@/test-utils';
import { apiClient } from '@/utils';

vi.mock(import('wagmi'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useAccount: vi.fn()
  };
});

vi.mock('@/utils', () => ({
  apiClient: {
    getMe: vi.fn()
  }
}));

describe('useGetUser', () => {
  const mockAddress = '0x123';

  beforeEach(vi.clearAllMocks);

  it('does not run query if no address is present', async () => {
    (useAccount as Mock).mockReturnValue({ address: null });

    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useGetUser>>(() => useGetUser(), {
      wrapper
    });

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.data).toBeUndefined();
    expect(result.current.isFetching).toBeFalsy();
  });

  it('fetches user data when address is present', async () => {
    const mockUserData = { name: 'John Doe', email: 'john@example.com' };

    (useAccount as Mock).mockReturnValue({ address: mockAddress });
    (apiClient.getMe as Mock).mockResolvedValue(mockUserData);

    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useGetUser>>(() => useGetUser(), {
      wrapper
    });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.data).toEqual(mockUserData);
  });

  it('returns undefined if fetching user data fails', async () => {
    (useAccount as Mock).mockReturnValue({ address: mockAddress });
    (apiClient.getMe as Mock).mockRejectedValue(new Error('Failed to fetch'));

    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useGetUser>>(() => useGetUser(), {
      wrapper
    });

    expect(result.current.data).toBeUndefined();
  });

  it('refetches data at the specified interval', async () => {
    (useAccount as Mock).mockReturnValue({ address: mockAddress });
    const mockUserData = { name: 'John Doe', email: 'john@example.com' };

    (apiClient.getMe as Mock).mockResolvedValue(mockUserData);

    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useGetUser>>(() => useGetUser(), {
      wrapper
    });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.data).toEqual(mockUserData);

    expect(apiClient.getMe).toHaveBeenCalledTimes(1);
  });
});
