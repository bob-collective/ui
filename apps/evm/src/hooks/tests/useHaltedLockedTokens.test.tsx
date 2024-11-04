import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useAccount, usePublicClient } from '@gobob/wagmi';
import { Mock, vi } from 'vitest';
import { PropsWithChildren } from 'react';
import { Wrapper } from '@/test-utils';

import { useTokens } from '../useTokens';
import { useHaltedLockedTokens } from '../useHaltedLockedTokens';

vi.mock(import('@gobob/wagmi'), async (importOriginal) => {
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
  {
    raw: { bridgeDisabled: true, address: '0xToken1' }
  },
  {
    raw: { bridgeDisabled: true, address: '0xToken2' }
  }
];
const mockLockContract = { address: '0xLockContract' };

const mockReadContract = vi.fn();

describe('useHaltedLockedTokens', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useAccount as Mock).mockReturnValue({ address: mockAddress });

    (usePublicClient as Mock).mockReturnValue({
      readContract: mockReadContract
    });

    (useTokens as Mock).mockReturnValue({ data: mockL1Tokens });
  });

  it.skip('returns halted locked tokens with positive balances', async () => {
    mockReadContract.mockResolvedValueOnce(100n).mockResolvedValueOnce(200n);

    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useHaltedLockedTokens>>(
      () => useHaltedLockedTokens(),
      { wrapper: Wrapper }
    );

    await waitFor(() => expect(result.current.data).toBeDefined());

    expect(result.current.data).toEqual([
      expect.objectContaining({ raw: { bridgeDisabled: true, address: '0xToken1' } }),
      expect.objectContaining({ raw: { bridgeDisabled: true, address: '0xToken2' } })
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

  it('returns an empty array if no tokens have positive locked balance', async () => {
    mockReadContract.mockResolvedValue(0n);

    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useHaltedLockedTokens>>(
      () => useHaltedLockedTokens(),
      { wrapper: Wrapper }
    );

    await waitFor(() => expect(result.current.data).toEqual([]));

    expect(result.current.data).toEqual([]);
  });

  it('handles errors gracefully', async () => {
    mockReadContract.mockRejectedValue(new Error('Contract read error'));

    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useHaltedLockedTokens>>(
      () => useHaltedLockedTokens(),
      { wrapper: Wrapper }
    );

    await waitFor(() => expect(result.current.data).toEqual([]));

    expect(result.current.data).toEqual([]);
  });

  it('does not run query if address is undefined', async () => {
    (useAccount as Mock).mockReturnValue({ address: undefined });

    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useHaltedLockedTokens>>(
      () => useHaltedLockedTokens(),
      { wrapper: Wrapper }
    );

    expect(result.current.data).toBeUndefined();
  });
});
