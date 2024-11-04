import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { useAccount } from '@gobob/wagmi';

import { useGetBridgeTransactions } from '../useGetBridgeTransactions';
import { useGetGatewayTransactions } from '../useGetGatewayTransactions';
import { useGetTransactions } from '../useGetTransactions';

import { useFeatureFlag } from '@/hooks/useFeatureFlag';

vi.mock(import('@gobob/wagmi'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useAccount: vi.fn()
  };
});

vi.mock(import('@/hooks/useFeatureFlag'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useFeatureFlag: vi.fn()
  };
});

vi.mock(import('../useGetGatewayTransactions'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useGetGatewayTransactions: vi.fn()
  };
});

vi.mock(import('../useGetBridgeTransactions'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useGetBridgeTransactions: vi.fn()
  };
});

describe('useGetTransactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns both gateway and bridge transactions sorted by date', async () => {
    const mockGatewayData = [{ date: new Date('2023-10-02T12:00:00Z') }];
    const mockBridgeData = [{ date: new Date('2023-10-01T12:00:00Z') }];
    const mockBridgeTransactions = { data: mockBridgeData, isLoading: false, refetch: vi.fn() };
    const mockGatewayTransactions = { data: mockGatewayData, isLoading: false, refetch: vi.fn() };

    (useFeatureFlag as Mock).mockReturnValue(true);
    (useGetBridgeTransactions as Mock).mockReturnValue(mockBridgeTransactions);
    (useGetGatewayTransactions as Mock).mockReturnValue(mockGatewayTransactions);
    (useAccount as Mock).mockReturnValueOnce({ address: '0x123' });

    const { result } = renderHook(() => useGetTransactions());

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    expect(result.current.data).toEqual([...mockGatewayData, ...mockBridgeData]);
  });

  it('correctly reflects loading state', async () => {
    (useFeatureFlag as Mock).mockReturnValue(true);
    (useGetGatewayTransactions as Mock).mockReturnValue({ isLoading: true });
    (useGetBridgeTransactions as Mock).mockReturnValue({ isLoading: false });
    (useAccount as Mock).mockReturnValueOnce({ address: '0x123' });

    const { result } = renderHook(() => useGetTransactions());

    expect(result.current.isLoading).toBe(true);
  });

  it('sets isInitialLoading correctly on first load', async () => {
    const mockBridgeTransactions = { data: [], isLoading: false, refetch: vi.fn() };
    const mockGatewayTransactions = { data: [], isLoading: false, refetch: vi.fn() };

    (useFeatureFlag as Mock).mockReturnValue(true);
    (useGetBridgeTransactions as Mock).mockReturnValue(mockBridgeTransactions);
    (useGetGatewayTransactions as Mock).mockReturnValue(mockGatewayTransactions);
    (useAccount as Mock).mockReturnValueOnce({ address: '0x123' });

    const { result } = renderHook(() => useGetTransactions());

    expect(result.current.isInitialLoading).toBe(result.current.isLoading);

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.isInitialLoading).toBeFalsy();
  });

  it('updates isInitialLoading on address change', async () => {
    const mockBridgeTransactions = { data: [], isLoading: false, refetch: vi.fn() };
    const mockGatewayTransactions = { data: [], isLoading: false, refetch: vi.fn() };

    (useFeatureFlag as Mock).mockReturnValue(true);
    (useGetBridgeTransactions as Mock).mockReturnValue(mockBridgeTransactions);
    (useGetGatewayTransactions as Mock).mockReturnValue(mockGatewayTransactions);
    (useAccount as Mock).mockReturnValueOnce({ address: '0x123' });

    const { result, rerender } = renderHook(() => useGetTransactions());

    expect(result.current.isInitialLoading).toBe(result.current.isLoading);

    (useAccount as Mock).mockReturnValueOnce({ address: '0x456' });
    rerender();

    await waitFor(() => expect(result.current.isInitialLoading).toBe(result.current.isLoading));
  });

  it('calls refetch functions for gateway and bridge transactions', async () => {
    const mockBridgeRefetch = vi.fn();
    const mockGatewayRefetch = vi.fn();

    const mockBridgeTransactions = { data: [], isLoading: false, refetch: mockBridgeRefetch };
    const mockGatewayTransactions = { data: [], isLoading: false, refetch: mockGatewayRefetch };

    (useFeatureFlag as Mock).mockReturnValue(true);
    (useGetBridgeTransactions as Mock).mockReturnValue(mockBridgeTransactions);
    (useGetGatewayTransactions as Mock).mockReturnValue(mockGatewayTransactions);
    (useAccount as Mock).mockReturnValueOnce({ address: '0x123' });

    const { result } = renderHook(() => useGetTransactions());

    result.current.refetchGatewayTxs();
    result.current.refetchBridgeTxs();

    expect(mockBridgeRefetch).toHaveBeenCalled();
    expect(mockGatewayRefetch).toHaveBeenCalled();
  });
});
