import { Wrapper } from '@gobob/test-utils';
import { useAccount } from '@gobob/wagmi';
import { renderHook } from '@testing-library/react-hooks';
import { PropsWithChildren } from 'react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { useGetGatewayTransactions } from '../useGetGatewayTransactions';

import { useFeatureFlag } from '@/hooks';
import { gatewaySDK } from '@/lib/bob-sdk';
import { esploraClient } from '@/utils';

const mockAddress = '0xMockAddress';
const mockOrders = [
  {
    getToken: vi.fn(),
    getTokenAmount: vi.fn(() => '1000000000000000000'),
    getStatus: vi.fn(() => ({ confirmed: true, pending: false, success: true, data: { confirmations: 6 } })),
    txid: 'mockTxId1',
    timestamp: 1690000000,
    txProofDifficultyFactor: 6,
    strategyAddress: 'mockStrategyAddress'
  }
];
const mockLatestHeight = 700000;

vi.mock(import('@gobob/wagmi'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useAccount: vi.fn()
  };
});

vi.mock('@/lib/bob-sdk', () => ({
  gatewaySDK: {
    getOrders: vi.fn()
  }
}));

vi.mock('@/utils', () => ({
  esploraClient: {
    getLatestHeight: vi.fn()
  }
}));

vi.mock(import('@/hooks'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useFeatureFlag: vi.fn()
  };
});

describe('useGetGatewayTransactions ', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAccount as Mock).mockReturnValue({ address: mockAddress });
    (gatewaySDK.getOrders as Mock).mockResolvedValue(mockOrders);
    (esploraClient.getLatestHeight as Mock).mockResolvedValue(mockLatestHeight);
    (useFeatureFlag as Mock).mockReturnValue(true);
  });

  it('fetches and returns the gateway transactions', async () => {
    const { result, waitForNextUpdate } = renderHook<PropsWithChildren, ReturnType<typeof useGetGatewayTransactions>>(
      () => useGetGatewayTransactions(),
      { wrapper: Wrapper }
    );

    await waitForNextUpdate();

    expect(gatewaySDK.getOrders).toHaveBeenCalledWith(mockAddress);

    expect(esploraClient.getLatestHeight).toHaveBeenCalled();

    expect(result.current.data).toBeDefined();
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0]).toEqual(
      expect.objectContaining({
        btcTxId: 'mockTxId1',
        date: new Date(1690000000000),
        confirmations: 6,
        totalConfirmations: 6,
        status: 'l2-confirmation',
        isPending: false,
        type: 'gateway',
        subType: 'stake'
      })
    );
  });

  it('does not fetch transactions if address is not available', async () => {
    (useAccount as Mock).mockReturnValue({ address: undefined });
    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useGetGatewayTransactions>>(
      () => useGetGatewayTransactions(),
      { wrapper: Wrapper }
    );

    expect(result.current.data).toBeUndefined();
    expect(gatewaySDK.getOrders).not.toHaveBeenCalled();
    expect(esploraClient.getLatestHeight).not.toHaveBeenCalled();
  });

  it('does not fetch transactions if BTC_GATEWAY feature is disabled', async () => {
    (useFeatureFlag as Mock).mockReturnValue(false);
    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useGetGatewayTransactions>>(
      () => useGetGatewayTransactions(),
      { wrapper: Wrapper }
    );

    expect(result.current.data).toBeUndefined();
    expect(gatewaySDK.getOrders).not.toHaveBeenCalled();
    expect(esploraClient.getLatestHeight).not.toHaveBeenCalled();
  });
});
