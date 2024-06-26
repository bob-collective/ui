import { Meta, StoryObj } from '@storybook/react';

import { XMark } from '../../icons';

import { Button, ButtonProps } from '.';

export default {
  title: 'Buttons/Button',
  component: Button,
  parameters: {
    layout: 'centered'
  },
  args: {
    children: 'Button'
  }
} as Meta<typeof Button>;

export const Solid: StoryObj<ButtonProps> = {
  args: {
    variant: 'solid'
  }
};

export const Outline: StoryObj<ButtonProps> = {
  args: {
    variant: 'outline'
  }
};

export const Ghost: StoryObj<ButtonProps> = {
  args: {
    variant: 'ghost'
  }
};

export const Icon: StoryObj<ButtonProps> = {
  args: {
    isIconOnly: true,
    children: <XMark />
  }
};

export const Link: StoryObj<ButtonProps> = {
  args: {
    asChild: true,
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    children: <a href='#'>Link</a>
  }
};

// export const Secondary: StoryObj<ButtonProps> = {
//   args: {
//     variant: 'secondary'
//   }
// };

// export const Outlined: StoryObj<ButtonProps> = {
//   args: {
//     variant: 'outlined'
//   }
// };

// export const Text: StoryObj<ButtonProps> = {
//   args: {
//     variant: 'text'
//   }
// };

// export const XSmall: StoryObj<ButtonProps> = {
//   args: {
//     size: 'x-small'
//   }
// };4

// export const Small: StoryObj<ButtonProps> = {
//   args: {
//     size: 'small'
//   }
// };

// export const Large: StoryObj<ButtonProps> = {
//   args: {
//     size: 'large'
//   }
// };

// export const Loading: StoryObj<ButtonProps> = {
//   render: (args) => (
//     <Flex direction='column' gap='spacing4'>
//       <Button {...args} />
//       <Button variant='secondary' {...args} />
//       <Button variant='outlined' {...args} />
//       <Button variant='text' {...args} />
//       <Button {...args} />
//     </Flex>
//   ),
//   args: {
//     loading: true
//   }
// };
