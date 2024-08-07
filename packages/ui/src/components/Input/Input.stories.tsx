import { Meta, StoryFn, StoryObj } from '@storybook/react';

import { InformationCircle } from '../../icons';
import { Flex } from '../Flex';

import { Input, InputProps } from '.';

export default {
  title: 'Forms/Input',
  component: Input,
  parameters: {
    layout: 'centered'
  },
  args: {
    label: 'Address'
  }
} as Meta<typeof Input>;

export const Default: StoryObj<InputProps> = {};

// export const Controlled: StoryFn<InputProps> = (args) => {
//   const [state, setState] = useState<string>();

//   return <Input {...args} value={state} onChange={(e) => setState(e.target.value)} />;
// };

// export const DefaultValue: StoryObj<InputProps> = {
//   args: {
//     defaultValue: 'Sesame Street'
//   }
// };

export const WithDescription: StoryObj<InputProps> = {
  args: {
    description: 'Please enter your street address'
  }
};

export const WithErrorMessage: StoryObj<InputProps> = {
  args: {
    errorMessage: 'Please enter your street address'
  }
};

// export const WithMultipleErrorMessage: StoryObj<InputProps> = {
//   args: {
//     errorMessage: ['Please enter your street address', 'Please enter your street address']
//   }
// };

// export const SideLabel: StoryObj<InputProps> = {
//   args: {
//     labelPosition: 'side'
//   }
// };

// export const MaxWidth: StoryObj<InputProps> = {
//   args: {
//     maxWidth: 'spacing28'
//   }
// };

export const Adornments: StoryFn<InputProps> = (args) => (
  <Flex direction='column' gap='md'>
    <Input {...args} label='Start Adornment' startAdornment={<InformationCircle size='s' />} />
    <Input {...args} endAdornment={<InformationCircle size='s' />} label='End Adornment' />
  </Flex>
);

export const Sizes: StoryFn<InputProps> = (args) => (
  <Flex direction='column' gap='md'>
    <Input {...args} label='Small' size='s' />
    <Input {...args} label='Medium' />
    <Input {...args} label='Large' size='lg' />
  </Flex>
);

export const Placeholder: StoryObj<InputProps> = {
  args: {
    placeholder: 'Enter address'
  }
};

export const Disabled: StoryObj<InputProps> = {
  args: {
    isDisabled: true
  }
};
