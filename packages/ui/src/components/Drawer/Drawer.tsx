'use client';

import { ContentProps, Drawer, ContentProps as DrawerContentProps, DialogProps as DrawerRootProps } from 'vaul';
import { forwardRef } from 'react';

import { ButtonProps } from '../Button';

import { StyledContent, StyledInnerContent, StyledOverlay, StyledButton, StyledTrigger } from './Drawer.style';

const DrawerOverlay = StyledOverlay;

const DrawerRoot = Drawer.Root;

const DrawerTitle = Drawer.Title;

const DrawerClose = Drawer.Close;

const DrawerTrigger = StyledTrigger;

const DrawerPortal = Drawer.Portal;

const DrawerContent = forwardRef<HTMLDivElement, ContentProps>(({ children, ...props }, ref) => (
  <StyledContent ref={ref} {...props}>
    <StyledInnerContent>{children}</StyledInnerContent>
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
}: ButtonProps) => (
  <StyledButton
    $color={color}
    $fullWidth={fullWidth}
    $isIconOnly={isIconOnly}
    $size={size}
    $variant={variant}
    {...props}
  />
);

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
