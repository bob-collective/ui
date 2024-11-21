import { renderHook } from '@testing-library/react-hooks';
import { useAccount } from '@gobob/wagmi';
import { createWalletClient, custom } from 'viem';
import { Mock, vi } from 'vitest';
import { useIsClient } from 'usehooks-ts';

import { useWalletClientL1, useWalletClientL2 } from '../useWalletClient';

import { chainL1, chainL2 } from '@/constants';

vi.mock('@gobob/wagmi', () => ({
  useAccount: vi.fn()
}));

vi.mock('viem', () => ({
  createWalletClient: vi.fn(),
  custom: vi.fn()
}));

vi.mock('@/constants', () => ({
  chainL1: { id: 1, name: 'L1 Chain' },
  chainL2: { id: 2, name: 'L2 Chain' }
}));

vi.mock('viem/op-stack', () => ({
  walletActionsL1: vi.fn(),
  walletActionsL2: vi.fn()
}));

vi.mock(import('usehooks-ts'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useIsClient: vi.fn()
  };
});

vi.mock('usehooks-ts', () => ({
  useIsClient: vi.fn()
}));

describe('useWalletClientL1 and useWalletClientL2 hooks', () => {
  const mockUseIsClient = useIsClient as Mock;
  const mockUseAccount = useAccount as Mock;
  const mockCreateWalletClient = createWalletClient as Mock;
  const mockCustom = custom as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCustom.mockReturnValue('mockTransport');
  });

  it('creates a wallet client for L1 with the correct account', () => {
    const mockAddress = '0x123';

    mockUseIsClient.mockReturnValue(true);
    mockUseAccount.mockReturnValue({ address: mockAddress });
    const extendMock = vi.fn().mockReturnValue('mockExtendedClientL1');

    mockCreateWalletClient.mockReturnValue({ extend: extendMock });

    const { result } = renderHook(() => useWalletClientL1());

    expect(mockCreateWalletClient).toHaveBeenCalledWith({
      account: mockAddress,
      chain: chainL1,
      transport: 'mockTransport'
    });

    expect(result.current).toBe('mockExtendedClientL1');
  });

  it('creates a wallet client for L2 with the correct account', () => {
    const mockAddress = '0xabc';

    mockUseIsClient.mockReturnValue(true);
    mockUseAccount.mockReturnValue({ address: mockAddress });
    const extendMock = vi.fn().mockReturnValue('mockExtendedClientL2');

    mockCreateWalletClient.mockReturnValue({ extend: extendMock });

    const { result } = renderHook(() => useWalletClientL2());

    expect(mockCreateWalletClient).toHaveBeenCalledWith({
      account: mockAddress,
      chain: chainL2,
      transport: 'mockTransport'
    });

    expect(result.current).toBe('mockExtendedClientL2');
  });
});
