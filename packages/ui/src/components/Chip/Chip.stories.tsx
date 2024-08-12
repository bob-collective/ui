import { Meta, StoryObj } from '@storybook/react';

import { Avatar, Flex, Spinner } from '..';

import { Chip, ChipProps } from '.';

export default {
  title: 'Content/Chip',
  component: Chip,
  parameters: {
    layout: 'centered'
  },
  args: { children: 'Chip' }
} as Meta<typeof Chip>;

export const Default: StoryObj<ChipProps> = {};

export const Sizes: StoryObj<ChipProps> = {
  render: (args) => (
    <Flex alignItems='center' gap='s'>
      <Chip {...args} size='s' />
      <Chip {...args} size='md' />
      <Chip {...args} size='lg' />
    </Flex>
  )
};

export const StartAdornment: StoryObj<ChipProps> = {
  args: {
    startAdornment: <Avatar size='2xl' src='https://ethereum-optimism.github.io/data/ETH/logo.svg' />,
    children: 'ETH'
  }
};

export const EndAdornment: StoryObj<ChipProps> = {
  args: {
    endAdornment: <Spinner size='xs' style={{ marginRight: 4 }} thickness={2} />,
    children: 'Loading...'
  }
};
