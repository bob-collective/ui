import { act, renderHook } from '@testing-library/react-hooks';
import { describe, expect, it, Mock, vi } from 'vitest';
import { useAccount } from 'wagmi';

import { useGateway } from '../useGateway';

import { useBtcAccount } from '@/hooks/btc';
import { wrapper } from '@/test-utils';
import { GatewayTransactionType } from '@/types';

vi.mock(import('wagmi'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useAccount: vi.fn()
  };
});

vi.mock(import('@/hooks/btc'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useBtcAccount: vi.fn()
  };
});

describe('useGateway', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useAccount as Mock).mockReturnValue({ address: '0x123456789abcdef' });
    (useBtcAccount as Mock).mockReturnValue({ connector: vi.fn() });
  });

  it('should initialize correctly with default settings', () => {
    const { result } = renderHook(
      () =>
        useGateway({
          params: { type: GatewayTransactionType.STRATEGY, assetName: 'BTC' }
        }),
      {
        wrapper
      }
    );

    expect(result.current.isReady).toBe(false);
    expect(result.current.isDisabled).toBe(true);
    expect(result.current.settings.topUp.isEnabled).toBe(true);
  });

  it('should correctly enable top-up setting', () => {
    const { result } = renderHook(
      () =>
        useGateway({
          params: { type: GatewayTransactionType.STRATEGY, assetName: 'BTC' }
        }),
      {
        wrapper
      }
    );

    act(() => {
      result.current.settings.topUp.enable(false);
    });

    expect(result.current.settings.topUp.isEnabled).toBe(false);
  });

  it('should calculate min amount correctly based on top-up state', () => {
    const { result } = renderHook(
      () =>
        useGateway({
          params: { type: GatewayTransactionType.STRATEGY, assetName: 'BTC' }
        }),
      {
        wrapper
      }
    );

    const initialMinAmount = result.current.query.minAmount;

    act(() => {
      result.current.settings.topUp.enable(false);
    });

    expect(result.current.query.minAmount).not.toEqual(initialMinAmount);
  });

  it.skip('should handle error when fee estimation fails', async () => {
    const mockFeeEstimateQueryResult = vi.fn();

    const { result } = renderHook(
      () =>
        useGateway({
          params: { type: GatewayTransactionType.STRATEGY, assetName: 'BTC' },
          onError: mockFeeEstimateQueryResult
        }),
      {
        wrapper
      }
    );

    await act(async () => {
      await result.current.mutation.mutateAsync({ evmAddress: '0x0000000000000000000000000000000000000000' });
    });

    expect(mockFeeEstimateQueryResult).toHaveBeenCalled();
  });
});
