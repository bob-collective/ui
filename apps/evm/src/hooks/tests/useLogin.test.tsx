import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { PropsWithChildren } from 'react';
import { SiweMessage } from 'siwe';
import { Mock, vi } from 'vitest';
import { useChainId, useSignMessage } from 'wagmi';

import { useLogin } from '../useLogin';

import { wrapper } from '@/test-utils';
import { apiClient } from '@/utils';

vi.mock(import('wagmi'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useSignMessage: vi.fn(),
    useChainId: vi.fn()
  };
});

vi.mock('@/utils', () => ({
  apiClient: {
    getNonce: vi.fn(),
    verify: vi.fn()
  }
}));

vi.mock('siwe', () => ({
  SiweMessage: vi.fn()
}));

describe('useLogin', () => {
  const mockAddress = '0xUserAddress';
  const mockNonce = 'test_nonce';
  const mockSignature = 'test_signature';
  const mockChainId = 1;

  beforeEach(() => {
    vi.clearAllMocks();

    (useChainId as Mock).mockReturnValue(mockChainId);
    (SiweMessage as Mock).mockReturnValue({ prepareMessage: vi.fn() });
    (useSignMessage as Mock).mockReturnValue({
      signMessageAsync: vi.fn()
    });

    (apiClient.getNonce as Mock).mockResolvedValue(mockNonce);
    (apiClient.verify as Mock).mockResolvedValue({ ok: true });
  });

  it('logs in successfully when all steps succeed', async () => {
    (useSignMessage as Mock).mockReturnValue({
      signMessageAsync: vi.fn().mockResolvedValue(mockSignature)
    });
    (SiweMessage as Mock).mockReturnValue({ prepareMessage: vi.fn() });

    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useLogin>>(() => useLogin(), {
      wrapper
    });

    await act(() => result.current.mutate(mockAddress));

    expect(apiClient.getNonce).toHaveBeenCalled();
    expect(apiClient.verify).toHaveBeenCalledWith(expect.any(Object), mockSignature);
  });

  it('throws an error if getNonce fails', async () => {
    const errorMessage = 'Failed to get nonce';

    (apiClient.getNonce as Mock).mockRejectedValue(new Error(errorMessage));
    (SiweMessage as Mock).mockReturnValue({ prepareMessage: vi.fn() });

    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useLogin>>(() => useLogin(), {
      wrapper
    });

    await waitFor(() => expect(act(() => result.current.mutateAsync(mockAddress))).rejects.toThrow());

    expect(apiClient.getNonce).toHaveBeenCalled();
    expect(apiClient.verify).not.toHaveBeenCalled();
  });

  it('throws an error if signature verification fails', async () => {
    const errorMessage = 'Verification failed';

    (apiClient.verify as Mock).mockResolvedValue({ ok: false, message: errorMessage });
    (SiweMessage as Mock).mockReturnValue({ prepareMessage: vi.fn() });

    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useLogin>>(() => useLogin(), {
      wrapper
    });

    await waitFor(() => expect(act(() => result.current.mutateAsync(mockAddress))).rejects.toThrow(errorMessage));

    expect(apiClient.getNonce).toHaveBeenCalled();
    expect(apiClient.verify).toHaveBeenCalled();
  });

  it('throws an error if signing fails', async () => {
    const errorMessage = 'Signing failed';

    (useSignMessage as Mock).mockReturnValue({
      signMessageAsync: vi.fn().mockRejectedValue(new Error(errorMessage))
    });
    (SiweMessage as Mock).mockReturnValue({ prepareMessage: vi.fn() });

    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useLogin>>(() => useLogin(), {
      wrapper
    });

    await waitFor(() => expect(act(() => result.current.mutateAsync(mockAddress))).rejects.toThrow(errorMessage));

    expect(apiClient.getNonce).toHaveBeenCalled();
    expect(apiClient.verify).not.toHaveBeenCalled();
  });
});
