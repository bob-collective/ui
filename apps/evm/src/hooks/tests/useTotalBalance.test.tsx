import { ChainId } from '@gobob/chains';
import { usePrices } from '@gobob/hooks';
import { useCurrencyFormatter, useLocale } from '@gobob/ui';
import { renderHook } from '@testing-library/react-hooks';
import Big from 'big.js';
import { Mock, vi } from 'vitest';

import { useBalances } from '../useBalances';
import { useTotalBalance } from '../useTotalBalance';

vi.mock('@gobob/hooks', () => ({
  usePrices: vi.fn()
}));

vi.mock('../useBalances', () => ({
  useBalances: vi.fn()
}));

vi.mock('@gobob/ui', () => ({
  useCurrencyFormatter: vi.fn(),
  useLocale: vi.fn()
}));

describe('useTotalBalance', () => {
  const mockUsePrices = usePrices as Mock;
  const mockUseBalances = useBalances as Mock;
  const mockUseCurrencyFormatter = useCurrencyFormatter as Mock;
  const mockUseLocale = useLocale as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calculates and formats total balance correctly', () => {
    const chainId = ChainId.ETHEREUM;

    mockUsePrices.mockReturnValue({
      getPrice: (symbol: string) => (symbol === 'ETH' ? 2000 : symbol === 'DAI' ? 1 : 0)
    });

    mockUseBalances.mockReturnValue({
      balances: {
        ETH: { currency: { symbol: 'ETH' }, toExact: () => '1' },
        DAI: { currency: { symbol: 'DAI' }, toExact: () => '1500' }
      }
    });

    mockUseCurrencyFormatter.mockReturnValue((amount: number) => `$${amount.toFixed(2)}`);
    mockUseLocale.mockReturnValue({ locale: 'en-US' });

    const { result } = renderHook(() => useTotalBalance(chainId));

    const ethBalance = new Big(1).mul(2000);
    const daiBalance = new Big(1500).mul(1);
    const totalBalance = ethBalance.plus(daiBalance);

    expect(result.current.amount).toEqual(totalBalance);
    expect(result.current.formatted).toBe(`$${totalBalance.toFixed(2)}`);
    expect(result.current.compact).toBe('$3.5K');
  });

  it('returns zero if balances are empty', () => {
    const chainId = ChainId.BOB_SEPOLIA;

    mockUsePrices.mockReturnValue({
      getPrice: () => 0
    });
    mockUseBalances.mockReturnValue({
      balances: {}
    });
    mockUseCurrencyFormatter.mockReturnValue(() => '$0.00');
    mockUseLocale.mockReturnValue({ locale: 'en-US' });

    const { result } = renderHook(() => useTotalBalance(chainId));

    expect(result.current.amount.toNumber()).toBe(0);
    expect(result.current.formatted).toBe('$0.00');
    expect(result.current.compact).toBe('$0');
  });
});
