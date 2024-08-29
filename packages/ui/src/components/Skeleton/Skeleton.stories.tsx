import { Meta, StoryObj } from '@storybook/react';

import { Skeleton, SkeletonProps } from '.';

export default {
  title: 'Content/Skeleton',
  component: Skeleton,
  parameters: {
    // layout: 'centered'
  }
} as Meta<typeof Skeleton>;

export const Default: StoryObj<SkeletonProps> = {};

export const MultipleText: StoryObj<SkeletonProps> = {
  args: {
    count: 2
  }
};

export const Avatar: StoryObj<SkeletonProps> = {
  args: {
    width: '4xl',
    height: '4xl',
    rounded: 'md'
  }
};
