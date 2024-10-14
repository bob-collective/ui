import { Meta, StoryObj } from '@storybook/react';

import { ConnectModal, ConnectModalProps } from '.';

export default {
  title: 'Connect/ConnectModal',
  component: ConnectModal,
  parameters: {
    layout: 'centered'
  }
} as Meta<typeof ConnectModal>;

export const Default: StoryObj<ConnectModalProps> = {
  args: { isOpen: true }
};

export const OnlyEVM: StoryObj<ConnectModalProps> = {
  args: { isOpen: true, type: 'evm' }
};

export const OnlyBTC: StoryObj<ConnectModalProps> = {
  args: { isOpen: true, type: 'btc' }
};
