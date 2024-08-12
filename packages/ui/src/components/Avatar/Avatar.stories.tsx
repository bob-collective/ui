import { Meta, StoryObj } from '@storybook/react';

import { Flex } from '../Flex';

import { Avatar, AvatarProps } from '.';

export default {
  title: 'Content/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered'
  },
  args: { src: 'https://ethereum-optimism.github.io/data/ETH/logo.svg' }
} as Meta<typeof Avatar>;

export const Default: StoryObj<AvatarProps> = {};

export const Sizes: StoryObj<AvatarProps> = {
  render: (args) => (
    <Flex alignItems='center' gap='md'>
      <Avatar size='2xl' {...args} />
      <Avatar size='3xl' {...args} />
      <Avatar size='4xl' {...args} />
    </Flex>
  )
};
