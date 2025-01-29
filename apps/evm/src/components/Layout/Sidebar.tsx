'use client';

import {
  Bars3,
  DrawerButton,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle,
  Flex
} from '@gobob/ui';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useState } from 'react';

import { Logo } from '../Logo';
import { SocialsGroup } from '../SocialsGroup';

import { Nav } from './Nav';
import { NavItem } from './NavItem';

import { ExternalLinks, RoutesPath } from '@/constants';

const Sidebar = ({ isMobile }: { isMobile: boolean }): JSX.Element | null => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { i18n } = useLingui();

  if (isMobile) {
    const handleClose = () => setSidebarOpen(false);

    return (
      <DrawerRoot open={isSidebarOpen} onClose={handleClose} onOpenChange={setSidebarOpen}>
        <DrawerButton isIconOnly aria-label={t(i18n)`open drawer`} hidden={!isMobile} variant='ghost'>
          <Bars3 size='lg' />
        </DrawerButton>
        <DrawerPortal>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerTitle hidden>
              <Trans>Navigation</Trans>
            </DrawerTitle>
            <Flex direction='column' elementType='nav' style={{ height: 'calc(100% - 2rem)' }}>
              <Flex direction='column' flex={1} gap='4xl'>
                <Logo href={RoutesPath.HOME} onPress={handleClose} />
                <Flex direction='column' flex={1} gap='lg' justifyContent='space-between'>
                  <Nav direction='column' gap='3xl'>
                    <NavItem href={RoutesPath.BRIDGE} onPress={handleClose}>
                      <Trans>Bridge</Trans>
                    </NavItem>
                    <NavItem href={RoutesPath.APPS} onPress={handleClose}>
                      <Trans>Apps</Trans>
                    </NavItem>
                    <NavItem href={RoutesPath.STRATEGIES} onPress={handleClose}>
                      <Trans>Stake</Trans>
                    </NavItem>
                    <NavItem href={RoutesPath.FUSION} onPress={handleClose}>
                      <Trans>Fusion</Trans>
                    </NavItem>
                    <NavItem isExternal href={ExternalLinks.SAFE} onPress={handleClose}>
                      <Trans>Multisig</Trans>
                    </NavItem>
                    <NavItem isExternal href={ExternalLinks.TERMS_OF_SERVICE} onPress={handleClose}>
                      <Trans>T&Cs</Trans>
                    </NavItem>
                    <NavItem isExternal href={ExternalLinks.DOCS} onPress={handleClose}>
                      <Trans>Dev</Trans>
                    </NavItem>
                    <NavItem isExternal href={ExternalLinks.HOMEPAGE} onPress={handleClose}>
                      <Trans>About</Trans>
                    </NavItem>
                    <NavItem isExternal href={ExternalLinks.DOCS} onPress={handleClose}>
                      <Trans>Docs</Trans>
                    </NavItem>
                  </Nav>
                  <SocialsGroup />
                </Flex>
              </Flex>
            </Flex>
          </DrawerContent>
        </DrawerPortal>
      </DrawerRoot>
    );
  }

  return null;
};

export { Sidebar };
