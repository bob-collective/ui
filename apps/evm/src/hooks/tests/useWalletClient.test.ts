import { renderHook } from '@testing-library/react-hooks';
import { useIsClient } from 'usehooks-ts';
import { createWalletClient, custom, http, zeroAddress } from 'viem';
import { Mock, vi } from 'vitest';
import { useAccount } from 'wagmi';

import { useWalletClientL1, useWalletClientL2 } from '../useWalletClient';

import { chainL1, chainL2 } from '@/constants';

vi.mock('wagmi', () => ({
  useAccount: vi.fn()
}));

vi.mock(import('viem'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    createWalletClient: vi.fn(),
    custom: vi.fn(),
    http: vi.fn()
  };
});

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

describe('useWalletClientL1 and useWalletClientL2 hooks', () => {
  const mockUseIsClient = useIsClient as Mock;
  const mockUseAccount = useAccount as Mock;
  const mockCreateWalletClient = createWalletClient as Mock;
  const mockCustom = custom as Mock;
  const mockHttp = http as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCustom.mockReturnValue('mockCustomTransport');
    mockHttp.mockReturnValue('mockHttpTransport');
  });

  it('creates a wallet client for L1 & L2 with the correct account', () => {
    mockUseIsClient.mockReturnValue(true);
    mockUseAccount.mockReturnValue({ address: zeroAddress });
    const extendMock = vi.fn().mockReturnValue('mockExtendedClient');

    mockCreateWalletClient.mockReturnValue({ extend: extendMock });

    const { result: resultL1 } = renderHook(() => useWalletClientL1());

    expect(mockCreateWalletClient).toHaveBeenCalledWith({
      account: zeroAddress,
      chain: chainL1,
      transport: mockHttp()
    });

    expect(resultL1.current).toBe('mockExtendedClient');

    const { result: resultL2 } = renderHook(() => useWalletClientL2());

    expect(mockCreateWalletClient).toHaveBeenCalledWith({
      account: zeroAddress,
      chain: chainL2,
      transport: mockHttp()
    });

    expect(resultL2.current).toBe('mockExtendedClient');
  });

  it('creates custom L1 & L2 connector if window.ethereum defined', () => {
    vi.stubGlobal('ethereum', {});

    mockUseIsClient.mockReturnValue(true);
    mockUseAccount.mockReturnValue({ address: zeroAddress });
    const extendMock = vi.fn().mockReturnValue('mockExtendedClient');

    mockCreateWalletClient.mockReturnValue({ extend: extendMock });

    const { result: resultL1 } = renderHook(() => useWalletClientL1());

    expect(mockCreateWalletClient).toHaveBeenCalledWith({
      account: zeroAddress,
      chain: chainL1,
      transport: mockCustom()
    });

    expect(resultL1.current).toBe('mockExtendedClient');

    const { result: resultL2 } = renderHook(() => useWalletClientL2());

    expect(mockCreateWalletClient).toHaveBeenCalledWith({
      account: zeroAddress,
      chain: chainL2,
      transport: mockCustom()
    });

    expect(resultL2.current).toBe('mockExtendedClient');
  });
});
