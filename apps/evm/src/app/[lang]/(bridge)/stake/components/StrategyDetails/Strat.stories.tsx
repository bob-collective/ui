import { Meta, StoryObj } from '@storybook/react';
import { Card } from '@gobob/ui';

import { StrategyBreakdown } from './StrategyBreakdown';

export default {
  title: 'Test/Start',
  component: StrategyBreakdown,
  parameters: {
    layout: 'centered'
  },
  argTypes: {}
} as Meta<typeof StrategyBreakdown>;

export const OnlyBody: StoryObj = {
  args: {
    nodes: [<Card>1</Card>, <Card>2</Card>, <Card>3</Card>, <Card>4</Card>]
  }
};
