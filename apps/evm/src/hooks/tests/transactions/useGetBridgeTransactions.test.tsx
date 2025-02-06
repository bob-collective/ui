import { ChainId } from '@gobob/chains';
import { CurrencyAmount, Ether } from '@gobob/currency';
import { act, renderHook } from '@testing-library/react-hooks';
import request from 'graphql-request';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { useAccount } from 'wagmi';

import { BridgeTransaction, useGetBridgeTransactions } from '../../transactions';

import { wrapper } from '@/test-utils';
import { BridgeTransactionStatus, TransactionDirection, TransactionType } from '@/types';

vi.mock(import('wagmi'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useAccount: vi.fn()
  };
});

vi.mock(import('graphql-request'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    default: vi.fn()
  };
});

describe('useGetBridgeTransactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches deposit and withdrawal transactions for a given account', async () => {
    const mockAddress = '0x12345';
    const mockDepositData = { eth: [], erc20: [] };
    const mockWithdrawData = { eth: [], erc20: [], westEth: [] };

    (useAccount as Mock).mockReturnValue({ address: mockAddress });

    (request as Mock).mockImplementation((url, _, variables) => {
      if (variables.address === mockAddress) {
        return url.includes('deposits') ? mockDepositData : mockWithdrawData;
      }
    });

    const { result, waitFor } = renderHook(() => useGetBridgeTransactions(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual([
      ...mockDepositData.eth,
      ...mockDepositData.erc20,
      ...mockWithdrawData.eth,
      ...mockWithdrawData.erc20,
      ...mockWithdrawData.westEth
    ]);
    expect(result.current.isLoading).toBe(false);
  });

  it('adds placeholder transactions correctly', async () => {
    const mockTransaction: BridgeTransaction = {
      transactionHash: '0xabc',
      amount: CurrencyAmount.fromRawAmount(Ether.onChain(ChainId.BOB), 100n),
      status: BridgeTransactionStatus.UNCONFIRMED_L1_TO_L2_MESSAGE,
      type: TransactionType.Bridge,
      from: '0xtest',
      to: '0xtest',
      l1Token: '0xtestl1',
      l2Token: '0xtestl2',
      date: new Date(),
      direction: TransactionDirection.L1_TO_L2,
      icon: ''
    };

    const { result } = renderHook(() => useGetBridgeTransactions(), { wrapper });

    act(() => {
      result.current.addPlaceholderTransaction(mockTransaction);
    });

    expect(result.current.data).toContain(mockTransaction);
  });
});
