import { Meta, StoryObj } from '@storybook/react';

import {
  DrawerRoot,
  DrawerContentProps,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerTitle,
  DrawerButton
} from '.';

export default {
  title: 'Overlays/Drawer',
  component: DrawerRoot,
  parameters: {
    layout: 'centered'
  }
} as Meta;

const Render = () => {
  return (
    <DrawerRoot>
      <DrawerButton isIconOnly variant='ghost'>
        Open
      </DrawerButton>
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerTitle>Drawer</DrawerTitle>
        </DrawerContent>
      </DrawerPortal>
    </DrawerRoot>
  );
};

export const Default: StoryObj<DrawerContentProps> = {
  render: Render
};
