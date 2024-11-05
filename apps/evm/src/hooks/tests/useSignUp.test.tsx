import { PropsWithChildren } from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useAccount, useSignMessage } from '@gobob/wagmi';
import { toast } from '@gobob/ui';
import { Mock, vi } from 'vitest';

import { useSignUp } from '../useSignUp';
import { useGetUser } from '../useGetUser';

import { Wrapper } from '@/test-utils';
import { apiClient } from '@/utils';

vi.mock(import('@gobob/wagmi'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useAccount: vi.fn(),
    useSignMessage: vi.fn()
  };
});

vi.mock(import('@gobob/ui'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    toast: { ...actual.toast, error: vi.fn(), success: vi.fn() } as unknown as (typeof actual)['toast']
  };
});

vi.mock('siwe', () => ({
  SiweMessage: vi.fn().mockImplementation((messageData) => ({
    prepareMessage: () => `Message for ${messageData.address}`
  }))
}));

vi.mock('@/utils', () => ({
  apiClient: {
    getNonce: vi.fn(),
    signUp: vi.fn()
  }
}));
vi.mock('../useGetUser', () => ({
  useGetUser: vi.fn(() => ({ refetch: vi.fn() }))
}));

describe('useSignUp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls onSuccess and refetchUser on successful sign-up', async () => {
    const mockAddress = '0x123';
    const mockChainId = 1;
    const mockNonce = 'mock-nonce';
    const mockRefetchUser = vi.fn();
    const mockSignMessageAsync = vi.fn().mockResolvedValue('mock-signature');
    const mockSignUpResponse = { ok: true };

    (useAccount as Mock).mockReturnValue({ address: mockAddress, chain: { id: mockChainId } });
    (useSignMessage as Mock).mockReturnValue({ signMessageAsync: mockSignMessageAsync });
    (apiClient.getNonce as Mock).mockResolvedValue(mockNonce);
    (apiClient.signUp as Mock).mockResolvedValue(mockSignUpResponse);
    (useGetUser as Mock).mockReturnValue({ refetch: mockRefetchUser });

    const onSuccess = vi.fn();
    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useSignUp>>(() => useSignUp({ onSuccess }), {
      wrapper: Wrapper
    });

    await act(() => result.current.mutate({}));

    expect(apiClient.getNonce).toHaveBeenCalled();
    expect(mockSignMessageAsync).toHaveBeenCalledWith({ message: 'Message for 0x123' });
    expect(apiClient.signUp).toHaveBeenCalledWith(expect.any(Object), 'mock-signature');
    expect(onSuccess).toHaveBeenCalled();
    expect(mockRefetchUser).toHaveBeenCalled();
  });

  it('shows error toast if user rejects the sign-up request', async () => {
    const mockAddress = '0x123';
    const mockChainId = 1;
    const mockSignMessageAsync = vi.fn().mockRejectedValue({ code: 4001 });

    (useAccount as Mock).mockReturnValue({ address: mockAddress, chain: { id: mockChainId } });
    (useSignMessage as Mock).mockReturnValue({ signMessageAsync: mockSignMessageAsync });

    const onError = vi.fn();
    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useSignUp>>(() => useSignUp({ onError }), {
      wrapper: Wrapper
    });

    await act(() => result.current.mutate({}));

    expect(onError).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('User rejected the request');
  });

  it('shows generic error toast if sign-up fails for other reasons', async () => {
    const mockAddress = '0x123';
    const mockChainId = 1;
    const mockSignMessageAsync = vi.fn().mockRejectedValue(new Error('Network error'));

    (useAccount as Mock).mockReturnValue({ address: mockAddress, chain: { id: mockChainId } });
    (useSignMessage as Mock).mockReturnValue({ signMessageAsync: mockSignMessageAsync });

    const onError = vi.fn();
    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useSignUp>>(() => useSignUp({ onError }), {
      wrapper: Wrapper
    });

    await act(() => result.current.mutate({}));

    expect(onError).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Network error');
  });
});
