import { usePrices } from '@gobob/hooks';
import { useCurrencyFormatter, useLocale } from '@gobob/ui';
import { renderHook } from '@testing-library/react-hooks';
import Big from 'big.js';
import { Mock, vi } from 'vitest';
import { useAccount as useSatsAccount, useBalance as useSatsBalance } from '@gobob/sats-wagmi';
import { useAccount } from 'wagmi';
import { ChainId } from '@gobob/chains';

import { useBalances } from '../useBalances';
import { useTotalBalance } from '../useTotalBalance';

import { wrapper } from '@/test-utils';
import { L1_CHAIN, L2_CHAIN } from '@/constants';

vi.mock('@gobob/hooks', () => ({
  usePrices: vi.fn()
}));

vi.mock('../useBalances', () => ({
  useBalances: vi.fn()
}));

vi.mock(import('@gobob/ui'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useCurrencyFormatter: vi.fn(),
    useLocale: vi.fn()
  };
});

vi.mock(import('wagmi'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useAccount: vi.fn()
  };
});

vi.mock(import('@gobob/sats-wagmi'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useBalance: vi.fn(),
    useAccount: vi.fn()
  };
});

describe('useTotalBalance', () => {
  const mockUsePrices = usePrices as Mock;
  const mockUseBalances = useBalances as Mock;
  const mockUseCurrencyFormatter = useCurrencyFormatter as Mock;
  const mockUseLocale = useLocale as Mock;
  const mockUseAccount = useAccount as Mock;
  const mockUseSatsAccount = useSatsAccount as Mock;
  const mockUseSatsBalance = useSatsBalance as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calculates and formats total balance correctly across L1 and L2', () => {
    const mockAddress = '0x123';

    mockUsePrices.mockReturnValue({
      getPrice: (symbol: string) => (symbol === 'ETH' ? 2000 : symbol === 'DAI' ? 1 : symbol === 'BTC' ? 30000 : 0)
    });

    mockUseBalances.mockImplementation((chainId) => {
      if (chainId === L1_CHAIN) {
        return {
          balances: {
            ETH: { currency: { symbol: 'ETH' }, toExact: () => '1' },
            DAI: { currency: { symbol: 'DAI' }, toExact: () => '1500' }
          },
          isPending: false
        };
      }
      if (chainId === L2_CHAIN) {
        return {
          balances: {
            ETH: { currency: { symbol: 'ETH' }, toExact: () => '1' }
          },
          isPending: false
        };
      }

      return { balances: {}, isPending: false };
    });

    mockUseCurrencyFormatter.mockReturnValue((amount: number) => `$${amount.toFixed(2)}`);
    mockUseLocale.mockReturnValue({ locale: 'en-US' });

    mockUseAccount.mockReturnValue({ address: mockAddress });
    mockUseSatsAccount.mockReturnValue({ address: mockAddress });
    mockUseSatsBalance.mockReturnValue({
      data: { total: Big(1).toString() },
      isPending: false
    });

    const { result } = renderHook(() => useTotalBalance(ChainId.BOB), { wrapper });

    expect(result.current.amount).toEqual(new Big(5500.0003));
    expect(result.current.formatted).toBe('$5500.00');
    expect(result.current.compact).toBe('$5.5K');
  });

  it('returns zero if all balances are empty across L1 and L2', () => {
    mockUsePrices.mockReturnValue({
      getPrice: () => 0
    });

    mockUseBalances.mockReturnValue({
      balances: {},
      isPending: false
    });

    mockUseCurrencyFormatter.mockReturnValue(() => '$0.00');
    mockUseLocale.mockReturnValue({ locale: 'en-US' });

    const { result } = renderHook(() => useTotalBalance(ChainId.BOB), { wrapper });

    expect(result.current.amount.toNumber()).toBe(0);
    expect(result.current.formatted).toBe('$0.00');
    expect(result.current.compact).toBe('$0');
  });

  it('handles pending states correctly across L1, L2, and BTC', () => {
    mockUsePrices.mockReturnValue({
      getPrice: () => 2000
    });

    mockUseBalances.mockImplementation((chainId) => {
      if (chainId === L1_CHAIN) {
        return {
          balances: {
            ETH: { currency: { symbol: 'ETH' }, toExact: () => '1' }
          },
          isPending: true
        };
      }
      if (chainId === L2_CHAIN) {
        return {
          balances: {},
          isPending: false
        };
      }

      return { balances: {}, isPending: false };
    });

    mockUseSatsBalance.mockReturnValue({
      data: null,
      isPending: true
    });
    mockUseAccount.mockReturnValue({ address: '0x123' });
    mockUseSatsAccount.mockReturnValue({ address: '0x123' });
    mockUseCurrencyFormatter.mockReturnValue((amount: number) => `$${amount.toFixed(2)}`);
    mockUseLocale.mockReturnValue({ locale: 'en-US' });

    const { result } = renderHook(() => useTotalBalance(ChainId.BOB), { wrapper });

    expect(result.current.isPending).toBe(true);
  });

  it('calculates balance when BTC is missing', () => {
    mockUsePrices.mockReturnValue({
      getPrice: (symbol: string) => (symbol === 'ETH' ? 2000 : 0)
    });

    mockUseBalances.mockImplementation((chainId) => {
      if (chainId === L1_CHAIN) {
        return {
          balances: {
            ETH: { currency: { symbol: 'ETH' }, toExact: () => '1' }
          },
          isPending: false
        };
      }

      return { balances: {}, isPending: false };
    });

    mockUseSatsBalance.mockReturnValue({
      data: null,
      isPending: false
    });
    mockUseCurrencyFormatter.mockReturnValue((amount: number) => `$${amount.toFixed(2)}`);
    mockUseLocale.mockReturnValue({ locale: 'en-US' });

    const { result } = renderHook(() => useTotalBalance(ChainId.BOB), { wrapper });

    const ethBalance = new Big(1).mul(2000);

    expect(result.current.amount).toEqual(ethBalance);
    expect(result.current.formatted).toBe(`$${ethBalance.toFixed(2)}`);
    expect(result.current.compact).toBe('$2K');
  });
});
