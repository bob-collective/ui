import { PropsWithChildren } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { ChainId } from '@gobob/chains';
import { CurrencyAmount, Ether } from '@gobob/currency';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { useAccount, useBalance, usePublicClient } from '@gobob/wagmi';

import { useBalances } from '../useBalances';
import { useTokens } from '../useTokens';

import { wrapper } from '@/test-utils';

vi.mock(import('@gobob/wagmi'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useAccount: vi.fn(),
    useBalance: vi.fn(),
    usePublicClient: vi.fn()
  };
});

vi.mock('../useTokens', () => ({
  useTokens: vi.fn()
}));

beforeEach(vi.clearAllMocks);
beforeEach(() => {
  (useAccount as Mock).mockReturnValue({ address: '0xTestAddress' });

  (useBalance as Mock).mockReturnValue({
    data: { value: 1000n },
    refetch: vi.fn()
  });

  (usePublicClient as Mock).mockReturnValue({
    multicall: vi.fn().mockResolvedValue([{ result: 500n }, { result: 1000n }])
  });

  (useTokens as Mock).mockReturnValue({
    data: [
      { raw: { address: '0xTokenAddress1', symbol: 'TOKEN1' }, currency: { decimals: 18 } },
      { raw: { address: '0xTokenAddress2', symbol: 'TOKEN2' }, currency: { decimals: 18 } }
    ]
  });
});

describe('useBalances', () => {
  it('should return correct balances for Ether and ERC20 tokens', async () => {
    const chainId = ChainId.ETHEREUM;

    const { result, waitForNextUpdate } = renderHook<PropsWithChildren, ReturnType<typeof useBalances>>(
      () => useBalances(chainId),
      { wrapper }
    );

    await waitForNextUpdate();

    const balances = result.current.balances;
    const ether = Ether.onChain(chainId);

    expect(balances[ether.symbol]).toBeInstanceOf(CurrencyAmount);
    expect(balances[ether.symbol]?.numerator).toBe(1000n);

    expect(balances['TOKEN1']).toBeInstanceOf(CurrencyAmount);
    expect(balances['TOKEN1']?.numerator).toBe(500n);
    expect(balances['TOKEN2']).toBeInstanceOf(CurrencyAmount);
    expect(balances['TOKEN2']?.numerator).toBe(1000n);
  });

  it('should return a getBalance function that retrieves balance by symbol', async () => {
    const chainId = ChainId.ETHEREUM;

    const { result, waitForNextUpdate } = renderHook<PropsWithChildren, ReturnType<typeof useBalances>>(
      () => useBalances(chainId),
      { wrapper }
    );

    await waitForNextUpdate();

    const ether = Ether.onChain(chainId);
    const etherBalance = result.current.getBalance(ether.symbol);
    const tokenBalance = result.current.getBalance('TOKEN1');

    expect(etherBalance).toBeInstanceOf(CurrencyAmount);
    expect(etherBalance?.numerator).toBe(1000n);

    expect(tokenBalance).toBeInstanceOf(CurrencyAmount);
    expect(tokenBalance?.numerator).toBe(500n);
  });
});
