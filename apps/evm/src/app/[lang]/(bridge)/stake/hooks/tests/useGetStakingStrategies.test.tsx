import { GatewayStrategyContract } from '@gobob/bob-sdk';
import { ChainId } from '@gobob/chains';
import { Token } from '@gobob/currency';
import { renderHook } from '@testing-library/react-hooks';
import { PropsWithChildren } from 'react';
import { Address } from 'viem';
import { useReadContracts } from 'wagmi';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { usePrices } from '@gobob/hooks';
import Big from 'big.js';

import { useGetStakingStrategies } from '../useGetStakingStrategies';

import { gatewaySDK } from '@/lib/bob-sdk';
import { wrapper } from '@/test-utils';

vi.mock(import('@/lib/bob-sdk'), async (importOriginal) => {
  const actual = await importOriginal();

  actual.gatewaySDK.getStrategies = vi.fn();

  return actual;
});

vi.mock(import('wagmi'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useReadContracts: vi.fn()
  };
});

vi.mock(import('@gobob/hooks'), async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    usePrices: vi.fn()
  };
});

const mockStrategy: GatewayStrategyContract = {
  id: 'bedrock-unibtc',
  type: 'deposit',
  address: '0x98649858a2d008410cb3bc6533fc2571905c456d',
  method: '',
  chain: {
    id: '',
    chainId: 60808,
    slug: 'bob',
    name: 'bob',
    logo: '',
    type: 'evm',
    singleChainSwap: true,
    singleChainStaking: true
  },
  integration: {
    type: 'staking',
    slug: 'bedrock-unibtc',
    name: 'Bedrock (uniBTC)',
    logo: 'https://raw.githubusercontent.com/bob-collective/bob/master/assets/uniBTC.svg',
    monetization: false
  },
  inputToken: {
    symbol: 'WBTC',
    address: '0x03c7054bcb39f7b2e5b2c7acb37583e32d70cfa3',
    logo: 'https://ethereum-optimism.github.io/data/WBTC/logo.svg',
    decimals: 8,
    chain: 'bob'
  },
  outputToken: {
    symbol: 'uniBTC',
    address: '0x236f8c0a61da474db21b693fb2ea7aab0c803894',
    logo: 'https://raw.githubusercontent.com/bob-collective/bob/master/assets/uniBTC.svg',
    decimals: 8,
    chain: 'bob'
  }
} as const;

const mockSegmentStrategy: GatewayStrategyContract = {
  id: 'segment-tbtc',
  type: 'deposit',
  address: '0xc8debccfca009f586263d1f1596504b104b22fd2',
  method: '',
  chain: {
    id: '',
    chainId: 60808,
    slug: 'bob',
    name: 'bob',
    logo: '',
    type: 'evm',
    singleChainSwap: true,
    singleChainStaking: true
  },
  integration: {
    type: 'lending',
    slug: 'segment-tbtc',
    name: 'Segment (tBTC)',
    logo: 'https://raw.githubusercontent.com/bob-collective/bob/master/assets/segment.svg',
    monetization: false
  },
  inputToken: {
    symbol: 'tBTC',
    address: '0xbba2ef945d523c4e2608c9e1214c2cc64d4fc2e2',
    logo: 'https://ethereum-optimism.github.io/data/tBTC/logo.svg',
    decimals: 18,
    chain: 'bob'
  },
  outputToken: {
    symbol: 'seTBTC',
    address: '0xd30288ea9873f376016a0250433b7ea375676077',
    logo: 'https://raw.githubusercontent.com/bob-collective/bob/master/assets/segment.svg',
    decimals: 8,
    chain: 'bob'
  }
} as const;

const mockPellUniBTCStrategy: GatewayStrategyContract = {
  id: 'pell-unibtc',
  type: 'deposit',
  address: '0xf5f2f90d3edc557b7ff0a285169a0b194df7b6f2',
  method: '',
  chain: {
    id: '',
    chainId: 60808,
    slug: 'bob',
    name: 'bob',
    logo: '',
    type: 'evm',
    singleChainSwap: true,
    singleChainStaking: true
  },
  integration: {
    type: 'staking',
    slug: 'pell-unibtc',
    name: 'Pell (uniBTC)',
    logo: '',
    monetization: false
  },
  inputToken: {
    symbol: 'WBTC',
    address: '0x03c7054bcb39f7b2e5b2c7acb37583e32d70cfa3',
    logo: 'https://ethereum-optimism.github.io/data/WBTC/logo.svg',
    decimals: 8,
    chain: 'bob'
  },
  outputToken: null
} as const;

const uniBTCDecimals = 8;

describe('useGetStakingStrategies', () => {
  afterEach(vi.clearAllMocks);

  const mockExchangeRateStored = 207520794671396869399540716n;
  const mockTotalSupply = 9036849246n;
  const mockTotalShares = 9223619436n;
  const mockUnderlying = '0xabc';

  const underlyingDecimals = 18;
  const decimals = 8;

  const mockPrice = 91000;

  beforeEach(() => {
    (useReadContracts as Mock)
      .mockReturnValueOnce({
        data: [mockExchangeRateStored, mockTotalSupply, mockUnderlying]
      })
      .mockReturnValueOnce({
        data: [underlyingDecimals]
      })
      .mockReturnValueOnce({
        data: [mockTotalSupply, decimals]
      })
      .mockReturnValueOnce({
        data: [mockTotalShares]
      })
      .mockReturnValueOnce({
        data: [mockTotalShares]
      });

    (usePrices as Mock).mockReturnValue({
      getPrice: () => mockPrice
    });
  });

  it('should return strategy data', async () => {
    (useReadContracts as Mock)
      .mockReturnValueOnce({
        data: [mockExchangeRateStored, mockTotalSupply, mockUnderlying]
      })
      .mockReturnValueOnce({
        data: [underlyingDecimals]
      })
      .mockReturnValueOnce({
        data: [mockTotalSupply, decimals]
      })
      .mockReturnValueOnce({
        data: [mockTotalShares]
      })
      .mockReturnValueOnce({
        data: [mockTotalShares]
      });

    (gatewaySDK.getStrategies as Mock).mockReturnValue([mockStrategy]);

    const { result, waitForValueToChange } = renderHook<PropsWithChildren, ReturnType<typeof useGetStakingStrategies>>(
      () => useGetStakingStrategies(),
      { wrapper }
    );

    await waitForValueToChange(() => result.current.data);

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
        : undefined,
      tvl: new Big(mockTotalSupply.toString())
        .mul(mockPrice)
        .div(10 ** decimals)
        .toNumber()
    };

    expect(gatewaySDK.getStrategies).toBeCalledTimes(1);
    expect(result.current.data).toEqual([expectedData]);
  });

  it('should return undefined currency when outputToken is missing', async () => {
    (useReadContracts as Mock)
      .mockReturnValueOnce({
        data: [mockExchangeRateStored, mockTotalSupply, mockUnderlying]
      })
      .mockReturnValueOnce({
        data: [underlyingDecimals]
      })
      .mockReturnValueOnce({
        data: [mockTotalSupply, decimals]
      })
      .mockReturnValueOnce({
        data: [mockTotalShares]
      })
      .mockReturnValueOnce({
        data: [mockTotalShares]
      });

    const mockStrategyWithoutToken = {
      outputToken: undefined
    };

    (gatewaySDK.getStrategies as Mock).mockReturnValue([mockStrategyWithoutToken]);

    const { result, waitForValueToChange } = renderHook<PropsWithChildren, ReturnType<typeof useGetStakingStrategies>>(
      () => useGetStakingStrategies(),
      { wrapper }
    );

    await waitForValueToChange(() => result.current.data);

    const expectedData = {
      raw: mockStrategyWithoutToken,
      currency: undefined,
      tvl: null
    };

    expect(result.current.data).toEqual([expectedData]);
  });

  it('should return tvl value if output token is se* token', async () => {
    (useReadContracts as Mock)
      .mockReturnValueOnce({
        data: [mockExchangeRateStored, mockTotalSupply, mockUnderlying]
      })
      .mockReturnValueOnce({
        data: [underlyingDecimals]
      })
      .mockReturnValueOnce({
        data: [mockTotalSupply, decimals]
      })
      .mockReturnValueOnce({
        data: [mockTotalShares]
      })
      .mockReturnValueOnce({
        data: [mockTotalShares]
      });

    (gatewaySDK.getStrategies as Mock).mockReturnValue([mockSegmentStrategy]);

    const { result, waitForValueToChange } = renderHook<PropsWithChildren, ReturnType<typeof useGetStakingStrategies>>(
      () => useGetStakingStrategies(),
      { wrapper }
    );

    await waitForValueToChange(() => result.current.data);

    const expectedData = {
      raw: mockSegmentStrategy,
      currency: mockSegmentStrategy.outputToken
        ? new Token(
            ChainId.BOB,
            mockSegmentStrategy.outputToken.address as Address,
            mockSegmentStrategy.outputToken.decimals,
            mockSegmentStrategy.outputToken.symbol,
            mockSegmentStrategy.outputToken.symbol
          )
        : undefined,
      tvl: new Big((mockExchangeRateStored * mockTotalSupply).toString())
        .mul(mockPrice)
        .div(1e18)
        .div(10 ** underlyingDecimals)
        .toNumber()
    };

    expect(result.current.data).toEqual([expectedData]);
  });

  it('should return tvl value if no output', async () => {
    (useReadContracts as Mock)
      .mockReturnValueOnce({
        data: [mockExchangeRateStored, mockTotalSupply, mockUnderlying]
      })
      .mockReturnValueOnce({
        data: [underlyingDecimals]
      })
      .mockReturnValueOnce({
        data: [mockTotalSupply, decimals]
      })
      .mockReturnValueOnce({
        data: [mockTotalShares]
      })
      .mockReturnValueOnce({
        data: [mockTotalShares]
      });

    (gatewaySDK.getStrategies as Mock).mockReturnValue([mockPellUniBTCStrategy]);

    const { result, waitForValueToChange } = renderHook<PropsWithChildren, ReturnType<typeof useGetStakingStrategies>>(
      () => useGetStakingStrategies(),
      { wrapper }
    );

    await waitForValueToChange(() => result.current.data);

    const expectedData = {
      raw: mockPellUniBTCStrategy,
      currency: undefined,
      tvl: new Big(mockTotalShares.toString())
        .mul(mockPrice)
        .div(10 ** uniBTCDecimals)
        .toNumber()
    };

    expect(result.current.data).toEqual([expectedData]);
  });
});
