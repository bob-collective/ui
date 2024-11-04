import { GatewayStrategyContract } from '@gobob/bob-sdk';
import { ChainId } from '@gobob/chains';
import { Token } from '@gobob/currency';
import { QueryClient, QueryClientProvider } from '@gobob/react-query';
import { renderHook } from '@testing-library/react-hooks';
import { PropsWithChildren } from 'react';
import { Address } from 'viem';
import { describe, expect, it, Mock, vi } from 'vitest';

vi.mock('@/lib/bob-sdk', () => ({
  gatewaySDK: {
    getStrategies: vi.fn()
  }
}));

vi.mock('@/hooks/useFeatureFlag', () => ({
  FeatureFlags: { BTC_GATEWAY: vi.fn() },
  useFeatureFlag: vi.fn()
}));

import { useGetStakingStrategies } from '../useGetStakingStrategies';

import { useFeatureFlag } from '@/hooks';
import { gatewaySDK } from '@/lib/bob-sdk';

const mockStrategy: GatewayStrategyContract = {
  id: 'testnet-strategy',
  type: 'deposit',
  address: '0x06cea150e651236499319d78f92791f0fae6fe67',
  method: '',
  chain: {
    id: '',
    chainId: 808813,
    slug: 'bob-sepolia',
    name: 'bob-sepolia',
    logo: '',
    type: 'evm',
    singleChainSwap: true,
    singleChainStaking: true
  },
  integration: {
    type: 'staking',
    slug: 'testnet-strategy',
    name: 'Testnet Strategy',
    logo: 'https://ethereum-optimism.github.io/data/tBTC/logo.svg',
    monetization: false
  },
  inputToken: {
    symbol: 'tBTC',
    address: '0x6744bAbDf02DCF578EA173A9F0637771A9e1c4d0',
    logo: 'https://ethereum-optimism.github.io/data/tBTC/logo.svg',
    decimals: 18,
    chain: 'bob-sepolia'
  },
  outputToken: {
    symbol: 'stmtBTC',
    address: '0xc4229678b65e2d9384fdf96f2e5d512d6eec0c77',
    logo: 'https://ethereum-optimism.github.io/data/tBTC/logo.svg',
    decimals: 18,
    chain: 'bob-sepolia'
  }
};

const createQueryClient = () => new QueryClient();

describe('useGetStakingStrategies', () => {
  beforeEach(vi.clearAllMocks);

  it('should return strategies with Token', async () => {
    (useFeatureFlag as Mock).mockReturnValue(true);
    (gatewaySDK.getStrategies as Mock).mockReturnValue([mockStrategy]);

    const queryClient = createQueryClient();
    const { result, waitFor } = renderHook<PropsWithChildren, ReturnType<typeof useGetStakingStrategies>>(
      () => useGetStakingStrategies(),
      {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      }
    );

    await waitFor(() => result.current.isSuccess);

    const expectedData = {
      raw: mockStrategy,
      currency: mockStrategy.outputToken
        ? new Token(
            ChainId.BOB,
            mockStrategy.outputToken.address as Address,
            mockStrategy.outputToken.decimals,
            mockStrategy.outputToken.symbol,
            mockStrategy.outputToken.symbol
          )
        : undefined
    };

    expect(gatewaySDK.getStrategies).toBeCalledTimes(1);
    expect(result.current.data).toEqual([expectedData]);
  });

  it('should return undefined currency when outputToken is missing', async () => {
    const mockStrategyWithoutToken = {
      outputToken: undefined
    };

    (useFeatureFlag as Mock).mockReturnValue(true);
    (gatewaySDK.getStrategies as Mock).mockReturnValue([mockStrategyWithoutToken]);

    const queryClient = createQueryClient();
    const { result, waitFor } = renderHook<PropsWithChildren, ReturnType<typeof useGetStakingStrategies>>(
      () => useGetStakingStrategies(),
      {
        wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      }
    );

    await waitFor(() => result.current.isSuccess);

    const expectedData = {
      raw: mockStrategyWithoutToken,
      currency: undefined
    };

    expect(result.current.data).toEqual([expectedData]);
  });
});
