import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { PropsWithChildren } from 'react';
import { Mock, vi } from 'vitest';
import { useAccount, usePublicClient } from 'wagmi';

import { useLockedTokens } from '../useLockedTokens';
import { useTokens } from '../useTokens';

import { wrapper } from '@/test-utils';

vi.mock(import('wagmi'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useAccount: vi.fn(),
    usePublicClient: vi.fn()
  };
});

vi.mock('../useTokens', () => ({
  useTokens: vi.fn()
}));

const mockAddress = '0xUserAddress';
const mockL1Tokens = [
  { raw: { bridgeDisabled: false, address: '0xToken1' } },
  { raw: { bridgeDisabled: false, address: '0xToken2' } }
];
const mockLockContract = { address: '0xLockContract' };

const mockReadContract = vi.fn();

describe('useLockedTokens', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useAccount as Mock).mockReturnValue({ address: mockAddress });

    (usePublicClient as Mock).mockReturnValue({
      readContract: mockReadContract
    });

    (useTokens as Mock).mockReturnValue({ data: mockL1Tokens });
  });

  it.skip('returns locked tokens with positive balances', async () => {
    mockReadContract.mockResolvedValueOnce(100n).mockResolvedValueOnce(200n);

    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useLockedTokens>>(() => useLockedTokens(), {
      wrapper
    });

    await waitFor(() => expect(result.current.data).toBeDefined());

    expect(result.current.data).toEqual([
      expect.objectContaining({ raw: { bridgeDisabled: false, address: '0xToken1' } }),
      expect.objectContaining({ raw: { bridgeDisabled: false, address: '0xToken2' } })
    ]);

    expect(mockReadContract).toHaveBeenCalledWith({
      abi: expect.any(Object),
      address: mockLockContract.address,
      functionName: 'deposits',
      args: [mockAddress, '0xToken1']
    });
    expect(mockReadContract).toHaveBeenCalledWith({
      abi: expect.any(Object),
      address: mockLockContract.address,
      functionName: 'deposits',
      args: [mockAddress, '0xToken2']
    });
  });

  it('returns an empty array if no tokens have positive locked balances', async () => {
    mockReadContract.mockResolvedValue(0n);

    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useLockedTokens>>(() => useLockedTokens(), {
      wrapper
    });

    await waitFor(() => expect(result.current.data).toEqual([]));

    expect(result.current.data).toEqual([]);
  });

  it('handles errors gracefully', async () => {
    mockReadContract.mockRejectedValue(new Error('Contract read error'));

    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useLockedTokens>>(() => useLockedTokens(), {
      wrapper
    });

    await waitFor(() => expect(result.current.data).toEqual([]));

    expect(result.current.data).toEqual([]);
  });

  it('does not run if no address is provided', async () => {
    (useAccount as Mock).mockReturnValue({ address: undefined });

    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useLockedTokens>>(() => useLockedTokens(), {
      wrapper
    });

    expect(result.current.data).toBeUndefined();
  });
});
