import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { mergeProps } from '@react-aria/utils';
import { EvmCurrencies } from '@gobob/currency';

import { TokenInput, TokenInputProps } from '..';

const items = [
  {
    balance: { amount: 2, usd: 900 },
    currency: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      address: '0x0',
      isNative: true
    } as unknown as EvmCurrencies,
    logoUrl: 'https://ethereum-optimism.github.io/data/ETH/logo.svg'
  },
  {
    balance: { amount: 500, usd: 500 },
    currency: { symbol: 'USDT', name: 'USDT', decimals: 6, address: '0x1', isToken: true } as unknown as EvmCurrencies,
    logoUrl: 'https://ethereum-optimism.github.io/data/USDT/logo.png'
  },
  {
    balance: { amount: 100, usd: 100 },
    currency: { symbol: 'USDC', name: 'USDC', decimals: 6, address: '0x2', isToken: true } as unknown as EvmCurrencies,
    logoUrl: 'https://ethereum-optimism.github.io/data/BridgedUSDC/logo.png'
  },
  {
    balance: { amount: 100, usd: 100 },
    currency: {
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin',
      decimals: 6,
      address: '0x3',
      isToken: true
    } as unknown as EvmCurrencies,
    logoUrl: 'https://ethereum-optimism.github.io/data/BridgedUSDC/logo.png'
  },
  {
    balance: { amount: 100, usd: 100 },
    currency: { symbol: 'WETH', name: 'WETH', decimals: 6, address: '0x4', isToken: true } as unknown as EvmCurrencies,
    logoUrl: 'https://ethereum-optimism.github.io/data/BridgedUSDC/logo.png'
  },
  {
    balance: { amount: 100, usd: 100 },
    currency: {
      symbol: 'BTC',
      name: 'Bitcoin',
      decimals: 6,
      address: '0x5',
      isToken: true
    } as unknown as EvmCurrencies,
    logoUrl: 'https://ethereum-optimism.github.io/data/BridgedUSDC/logo.png'
  },
  {
    balance: { amount: 100, usd: 100 },
    currency: {
      symbol: 'stETH',
      name: 'Lido Staked Ether',
      decimals: 6,
      address: '0x6',
      isToken: true
    } as unknown as EvmCurrencies,
    logoUrl: 'https://coin-images.coingecko.com/coins/images/13442/large/steth_logo.png?1696513206'
  },
  {
    balance: { amount: 100, usd: 100 },
    currency: {
      symbol: 'rETH',
      name: 'Rocket Pool ETH',
      decimals: 6,
      address: '0x7',
      isToken: true
    } as unknown as EvmCurrencies,
    logoUrl: 'https://coin-images.coingecko.com/coins/images/20764/large/reth.png?1696520159'
  }
];

export default {
  title: 'Forms/TokenInput',
  component: TokenInput,
  parameters: {
    layout: 'centered'
  },
  args: {
    type: 'selectable',
    label: 'Amount',
    items
  }
} as Meta<typeof TokenInput>;

export const Selectable: StoryObj<TokenInputProps> = {};

export const SelectableDefaultValue: StoryObj<TokenInputProps> = {
  args: {
    selectProps: {
      defaultValue: 'ETH'
    }
  }
};

const ControlledSelectComponent = (args: any) => {
  const [state, setState] = useState(items[0].currency);

  return (
    <TokenInput
      {...args}
      selectProps={mergeProps(args.selectProps, { value: state.symbol, onSelectionChange: setState })}
      type='selectable'
    />
  );
};

export const SelectableControlledValue: StoryObj<TokenInputProps> = {
  render: ControlledSelectComponent
};

export const SelectableWithBalance: StoryObj<TokenInputProps> = {
  args: {
    balance: '10',
    valueUSD: 0
  }
};

export const SelectableDescription: StoryObj<TokenInputProps> = {
  args: {
    selectProps: {
      description: 'Please select a token'
    }
  }
};

export const SelectableInputErrorMessage: StoryObj<TokenInputProps> = {
  args: {
    errorMessage: 'Token field is required'
  }
};

export const SelectableErrorMessage: StoryObj<TokenInputProps> = {
  args: {
    selectProps: {
      errorMessage: 'Token field is required'
    }
  }
};

export const AutoComplete: StoryObj<TokenInputProps> = {
  args: {
    featuredItems: items.slice(0, 6),
    selectProps: {},
    items: items.map((item) => ({ ...item, balance: undefined }))
  }
};
