import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { PropsWithChildren } from 'react';
import { SiweMessage } from 'siwe';
import { Mock, vi } from 'vitest';
import { useChainId, useSignMessage } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';

import { useLogin } from '../useLogin';

import { wrapper } from '@/test-utils';
import { apiClient } from '@/utils';
import { FetchError } from '@/types/fetch';

vi.mock(import('wagmi'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useSignMessage: vi.fn(),
    useChainId: vi.fn()
  };
});

vi.mock(import('@tanstack/react-query'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useQueryClient: vi.fn(() => ({ setQueryData: vi.fn() })) as any
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
  const mockSetQueryData = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useChainId as Mock).mockReturnValue(mockChainId);
    (SiweMessage as Mock).mockReturnValue({ prepareMessage: vi.fn() });
    (useSignMessage as Mock).mockReturnValue({
      signMessageAsync: vi.fn()
    });
    (useQueryClient as Mock).mockReturnValue({ setQueryData: mockSetQueryData });

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
    expect(mockSetQueryData).toHaveBeenCalled();
  });

  it('throws an error if getNonce fails', async () => {
    const errorMessage = 'Failed to get nonce';

    (apiClient.getNonce as Mock).mockRejectedValue(new Error(errorMessage));
    (SiweMessage as Mock).mockReturnValue({ prepareMessage: vi.fn() });

    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useLogin>>(() => useLogin(), {
      wrapper
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await waitFor(() => expect(act(() => result.current.mutateAsync(mockAddress) as any)).rejects.toThrow());

    expect(apiClient.getNonce).toHaveBeenCalled();
    expect(apiClient.verify).not.toHaveBeenCalled();
  });

  it('throws an error if signature verification fails', async () => {
    const errorMessage = 'Verification failed';

    (apiClient.verify as Mock).mockRejectedValue(new FetchError(errorMessage, 401, errorMessage));
    (SiweMessage as Mock).mockReturnValue({ prepareMessage: vi.fn() });

    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useLogin>>(() => useLogin(), {
      wrapper
    });

    await waitFor(() =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(act(() => result.current.mutateAsync(mockAddress) as any)).rejects.toThrow(errorMessage)
    );

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

    await waitFor(() =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(act(() => result.current.mutateAsync(mockAddress) as any)).rejects.toThrow(errorMessage)
    );

    expect(apiClient.getNonce).toHaveBeenCalled();
    expect(apiClient.verify).not.toHaveBeenCalled();
  });
});
