'use client';

import { forwardRef } from 'react';
import { ContentProps, Drawer, ContentProps as DrawerContentProps, DialogProps as DrawerRootProps } from 'vaul';
import { useFocusRing } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';

import { ButtonProps } from '../Button';

import {
  StyledButton,
  StyledContent,
  StyledDragIndicator,
  StyledInnerContent,
  StyledOverlay,
  StyledTrigger
} from './Drawer.style';

const DrawerOverlay = StyledOverlay;

const DrawerRoot = Drawer.Root;

const DrawerTitle = Drawer.Title;

const DrawerClose = Drawer.Close;

const DrawerTrigger = StyledTrigger;

const DrawerPortal = Drawer.Portal;

const DrawerContent = forwardRef<HTMLDivElement, ContentProps>(({ children, ...props }, ref) => (
  <StyledContent ref={ref} {...props}>
    <StyledInnerContent>
      <StyledDragIndicator aria-hidden />
      {children}
    </StyledInnerContent>
  </StyledContent>
));

DrawerContent.displayName = 'DrawerContent';

const DrawerButton = ({
  variant = 'solid',
  size = 'md',
  color = 'default',
  fullWidth,
  isIconOnly,
  ...props
}: ButtonProps) => {
  const { focusProps, isFocusVisible } = useFocusRing(props);

  return (
    <StyledButton
      $color={color}
      $fullWidth={fullWidth}
      $isFocusVisible={isFocusVisible}
      $isIconOnly={isIconOnly}
      $size={size}
      $variant={variant}
      {...mergeProps(props, focusProps)}
    />
  );
};

export {
  DrawerButton,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger
};
export type { DrawerContentProps, DrawerRootProps };
