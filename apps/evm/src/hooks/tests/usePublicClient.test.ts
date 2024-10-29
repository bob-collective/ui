import { renderHook } from '@testing-library/react-hooks';
import { createPublicClient, http } from 'viem';
import { publicActionsL1, publicActionsL2 } from 'viem/op-stack';
import { Mock, vi } from 'vitest';

import { usePublicClientL1, usePublicClientL2 } from '../usePublicClient';

vi.mock(import('viem'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    getAddress: vi.fn((address) => address),
    createPublicClient: vi.fn(),
    http: vi.fn()
  };
});

vi.mock('viem/op-stack', () => ({
  publicActionsL1: vi.fn(),
  publicActionsL2: vi.fn()
}));

describe('usePublicClientL1 and usePublicClientL2 hooks', () => {
  const mockClient = {
    extend: vi.fn(() => mockClient)
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (createPublicClient as Mock).mockReturnValue(mockClient);
    (http as Mock).mockReturnValue('mockTransport');
  });

  it('should initialize and extend public client for L1', async () => {
    const l1Actions = vi.fn();

    (publicActionsL1 as Mock).mockReturnValue(l1Actions);

    const { result } = renderHook(() => usePublicClientL1());

    expect(createPublicClient).toHaveBeenCalledWith({
      chain: expect.any(Object),
      transport: 'mockTransport'
    });
    expect(mockClient.extend).toHaveBeenCalledWith(l1Actions);
    expect(result.current).toBe(mockClient);
  });

  it('should initialize and extend public client for L2', async () => {
    const l2Actions = vi.fn();

    (publicActionsL2 as Mock).mockReturnValue(l2Actions);

    const { result } = renderHook(() => usePublicClientL2());

    expect(createPublicClient).toHaveBeenCalledWith({
      chain: expect.any(Object),
      transport: 'mockTransport'
    });
    expect(mockClient.extend).toHaveBeenCalledWith(l2Actions);
    expect(result.current).toBe(mockClient);
  });
});
