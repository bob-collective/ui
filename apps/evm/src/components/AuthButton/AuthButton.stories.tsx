import { Meta, StoryObj } from '@storybook/react';
import { useDisconnect, useAccount } from '@gobob/wagmi';
import { useDisconnect as useStasDisconnect, useAccount as useSatsAccount } from '@gobob/sats-wagmi';
import { Flex } from '@gobob/ui';

import { ConnectProvider } from '../..';

import { AuthButton as Component, AuthButtonProps } from '.';

export default {
  title: 'Connect/AuthButton',
  component: Component,
  parameters: {
    layout: 'centered'
  },
  decorators: [
    (Story) => (
      <ConnectProvider>
        <Story />
      </ConnectProvider>
    )
  ]
} as Meta<typeof Component>;

const RenderDefault = (args: AuthButtonProps) => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const handleDisconnect = () => {
    if (address) {
      disconnect();
    }
  };

  return (
    <Flex gap='s'>
      <Component {...args}>{address}</Component>
      {address && <Component onPress={handleDisconnect}>Disconnect</Component>}
    </Flex>
  );
};

export const Default: StoryObj<AuthButtonProps> = {
  args: {},
  render: RenderDefault
};

const RenderOnlyBtc = (args: AuthButtonProps) => {
  const { address } = useSatsAccount();
  const { disconnect } = useStasDisconnect();

  const handleDisconnect = () => {
    if (address) {
      disconnect();
    }
  };

  return (
    <Flex gap='s'>
      <Component {...args}>{address}</Component>
      {address && <Component onPress={handleDisconnect}>Disconnect</Component>}
    </Flex>
  );
};

export const OnlyBTC: StoryObj<AuthButtonProps> = {
  args: { isBtcAuthRequired: true },
  decorators: [
    (Story) => (
      <ConnectProvider type='btc'>
        <Story />
      </ConnectProvider>
    )
  ],
  render: RenderOnlyBtc
};

const RenderBtcEvm = (args: AuthButtonProps) => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { address: btcAddress } = useSatsAccount();
  const { disconnect: btcDisconnect } = useStasDisconnect();

  const handleDisconnect = () => {
    if (address) {
      disconnect();
    }

    if (btcAddress) {
      btcDisconnect();
    }
  };

  return (
    <Flex gap='s'>
      <Component {...args}>
        {address}
        <br />
        {btcAddress}
      </Component>
      {address && <Component onPress={handleDisconnect}>Disconnect</Component>}
    </Flex>
  );
};

export const EVM_and_BTC: StoryObj<AuthButtonProps> = {
  args: { isBtcAuthRequired: true },

  render: RenderBtcEvm
};
