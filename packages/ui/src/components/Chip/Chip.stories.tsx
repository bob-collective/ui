import { Meta, StoryObj } from '@storybook/react';

import { Chip, ChipProps } from '.';

export default {
  title: 'Content/Chip',
  component: Chip,
  parameters: {
    layout: 'centered'
  },
  args: { children: 'BTC' }
} as Meta<typeof Chip>;

export const Default: StoryObj<ChipProps> = {};
