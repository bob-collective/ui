import { ChainId } from '@gobob/chains';
import { renderHook } from '@testing-library/react-hooks';
import { describe, expect, it, Mock, vi } from 'vitest';

import { useCrossChainMessenger } from '../useCrossChainMessenger';

vi.mock(import('@gobob/wagmi'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useEthersProvider: vi.fn(),
    useEthersSigner: vi.fn(),
    useAccount: vi.fn()
  };
});

vi.mock(import('@eth-optimism/sdk'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    CrossChainMessenger: vi.fn()
  };
});

describe('useCrossChainMessenger', () => {
  const mockProvider = { provider: true };
  const mockSigner = { signer: true };

  beforeEach(vi.clearAllMocks);

  it('should return CrossChainMessenger when both L1 and L2 providers are available', async () => {
    const { useEthersProvider, useEthersSigner, useAccount } = await import('@gobob/wagmi');
    const { CrossChainMessenger } = await import('@eth-optimism/sdk');

    const mockMessenger = { messenger: true };

    (useEthersProvider as Mock).mockReturnValue(mockProvider);
    (useEthersSigner as Mock).mockReturnValue(mockSigner);
    (CrossChainMessenger as Mock).mockReturnValue(mockMessenger);
    (useAccount as Mock).mockReturnValue({ chain: ChainId.BOB });

    const { result } = renderHook(() => useCrossChainMessenger());

    expect(result.current).toBe(mockMessenger);
    expect(CrossChainMessenger).toHaveBeenCalledTimes(1);
  });

  it('should create CrossChainMessenger when chain is L1', async () => {
    const { useEthersProvider, useEthersSigner, useAccount } = await import('@gobob/wagmi');
    const { CrossChainMessenger } = await import('@eth-optimism/sdk');

    const mockMessenger = { messenger: true };

    (useEthersProvider as Mock).mockReturnValue(mockProvider);
    (useEthersSigner as Mock).mockReturnValue(mockSigner);
    (useAccount as Mock).mockReturnValue({ chain: ChainId.BOB });
    (CrossChainMessenger as Mock).mockReturnValue(mockMessenger);

    const { result } = renderHook(() => useCrossChainMessenger());

    expect(result.current).toBe(mockMessenger);
    expect(CrossChainMessenger).toHaveBeenCalledTimes(1);
  });

  it('should create CrossChainMessenger when chain is L2', async () => {
    const { useEthersProvider, useEthersSigner, useAccount } = await import('@gobob/wagmi');
    const { CrossChainMessenger } = await import('@eth-optimism/sdk');

    const mockMessenger = { messenger: true };

    (useEthersProvider as Mock).mockReturnValue(mockProvider);
    (useEthersSigner as Mock).mockReturnValue(mockSigner);
    (useAccount as Mock).mockReturnValue({ chain: ChainId.BOB_SEPOLIA });
    (CrossChainMessenger as Mock).mockReturnValue(mockMessenger);

    const { result } = renderHook(() => useCrossChainMessenger());

    expect(result.current).toBe(mockMessenger);
    expect(CrossChainMessenger).toHaveBeenCalledTimes(1);
  });
});
