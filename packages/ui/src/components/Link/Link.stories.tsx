import { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';

import { Link, LinkProps } from '.';

export default {
  title: 'Navigation/Link',
  component: Link,
  parameters: {
    layout: 'centered'
  },
  args: {
    children: 'Text Link',
    href: '#'
  }
} as Meta<typeof Link>;

export const Default: StoryObj<LinkProps> = {};

export const External: StoryObj<LinkProps> = {
  args: {
    external: true,
    icon: true
  }
};

export const HoverUnderlined: StoryObj<LinkProps> = {
  args: {
    underlined: 'hover'
  }
};

export const WithoutHref: StoryObj<LinkProps> = {
  args: {
    href: undefined
  }
};

export const Disabled: StoryObj<LinkProps> = {
  args: {
    isDisabled: true
  }
};

export const Polymorphic: StoryObj<LinkProps> = {
  render: () => <Button elementType={Link}>Polymorphic</Button>
};
