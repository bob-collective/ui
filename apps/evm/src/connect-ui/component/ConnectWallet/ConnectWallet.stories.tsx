import { Meta, StoryObj } from '@storybook/react';

import { ConnectProvider } from '../..';

import { ConnectWallet as Component, ConnectWalletProps } from '.';

export default {
  title: 'Connect/ConnectWallet',
  component: Component,
  parameters: {
    layout: 'centered'
  },
  decorators: [
    (Story) => {
      return (
        <ConnectProvider>
          <Story />
        </ConnectProvider>
      );
    }
  ]
} as Meta<typeof Component>;

export const Default: StoryObj<ConnectWalletProps> = {
  args: {}
};

export const OnlyEVM: StoryObj<ConnectWalletProps> = {
  args: {},
  decorators: [
    (Story) => {
      return (
        <ConnectProvider type='evm'>
          <Story />
        </ConnectProvider>
      );
    }
  ]
};
