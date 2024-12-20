import { PropsWithChildren } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { ChainId } from '@gobob/chains';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { ERC20Token } from '@gobob/currency';

import { BridgeToken, useBridgeTokens } from '../useBridgeTokens';
import { useTokens } from '../useTokens';

import { wrapper } from '@/test-utils';

vi.mock('../useTokens', () => ({
  useTokens: vi.fn()
}));

describe('useBridgeTokens', () => {
  const mockL1Tokens = [
    {
      raw: { address: '0x0000000000000000000000000000000000000001', symbol: 'TOKEN1' },
      currency: new ERC20Token(
        ChainId.ETHEREUM,
        '0x0000000000000000000000000000000000000001',
        18,
        'TOKEN1',
        'Token One'
      )
    },
    {
      raw: { address: '0x0000000000000000000000000000000000000002', symbol: 'TOKEN2' },
      currency: new ERC20Token(
        ChainId.ETHEREUM,
        '0x0000000000000000000000000000000000000002',
        18,
        'TOKEN2',
        'Token Two'
      )
    }
  ];

  const mockL2Tokens = [
    {
      raw: { address: '0x0000000000000000000000000000000000000003', symbol: 'TOKEN1' },
      currency: new ERC20Token(
        ChainId.SEPOLIA,
        '0x0000000000000000000000000000000000000003',
        18,
        'TOKEN1',
        'Token One on L2'
      )
    },
    {
      raw: { address: '0x0000000000000000000000000000000000000004', symbol: 'TOKEN3' },
      currency: new ERC20Token(
        ChainId.SEPOLIA,
        '0x0000000000000000000000000000000000000004',
        18,
        'TOKEN3',
        'Token Three on L2'
      )
    }
  ];

  beforeEach(vi.clearAllMocks);

  it('should return matched tokens between L1 and L2 chains by symbol', async () => {
    (useTokens as Mock).mockImplementation((chainId) => {
      return chainId === ChainId.ETHEREUM ? { data: mockL1Tokens } : { data: mockL2Tokens };
    });

    const { result, waitForNextUpdate } = renderHook<PropsWithChildren, ReturnType<typeof useBridgeTokens>>(
      () => useBridgeTokens(ChainId.ETHEREUM, ChainId.SEPOLIA),
      { wrapper }
    );

    await waitForNextUpdate();

    const bridgeTokens = result.current.data as [BridgeToken, BridgeToken, ...BridgeToken[]];

    expect(bridgeTokens).toHaveLength(1);
    expect(bridgeTokens[0]).toMatchObject({
      l1Token: { address: '0x0000000000000000000000000000000000000001', symbol: 'TOKEN1' },
      l2Token: { address: '0x0000000000000000000000000000000000000003', symbol: 'TOKEN1' },
      l1Currency: expect.any(ERC20Token),
      l2Currency: expect.any(ERC20Token)
    });

    expect(bridgeTokens[0].l1Currency.symbol).toBe('TOKEN1');
    expect(bridgeTokens[0].l2Currency.symbol).toBe('TOKEN1');
  });

  it('should return an empty array if no tokens match between L1 and L2', async () => {
    (useTokens as Mock)
      .mockImplementationOnce(() => ({ data: mockL1Tokens }))
      .mockImplementationOnce(() => ({
        data: [
          {
            raw: { address: '0x0000000000000000000000000000000000000005', symbol: 'TOKEN4' },
            currency: new ERC20Token(
              ChainId.SEPOLIA,
              '0x0000000000000000000000000000000000000005',
              18,
              'TOKEN4',
              'Token Four'
            )
          }
        ]
      }));

    const { result, waitForNextUpdate } = renderHook<PropsWithChildren, ReturnType<typeof useBridgeTokens>>(
      () => useBridgeTokens(ChainId.ETHEREUM, ChainId.SEPOLIA),
      { wrapper }
    );

    await waitForNextUpdate();

    expect(result.current.data).toEqual([]);
  });

  it('should handle empty data for tokens on L1 or L2 gracefully', async () => {
    (useTokens as Mock).mockImplementation((chainId) => {
      return chainId === ChainId.ETHEREUM ? { data: mockL1Tokens } : { data: null };
    });

    const { result } = renderHook<PropsWithChildren, ReturnType<typeof useBridgeTokens>>(
      () => useBridgeTokens(ChainId.ETHEREUM, ChainId.SEPOLIA),
      { wrapper }
    );

    expect(result.current.data).toBeUndefined();
  });
});
