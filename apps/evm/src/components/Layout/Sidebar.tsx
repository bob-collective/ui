'use client';

import { Button, Flex, XMark, useMediaQuery } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useTheme } from 'styled-components';

import { Logo } from '../Logo';
import { SocialsGroup } from '../SocialsGroup';

import { StyledDrawer } from './Layout.style';
import { useLayoutContext } from './LayoutContext';
import { Nav } from './Nav';
import { NavItem } from './NavItem';

import { ExternalLinks, RoutesPath } from '@/constants';

const Sidebar = (): JSX.Element | null => {
  const { isSidebarOpen, setSidebarOpen } = useLayoutContext();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  if (isMobile) {
    const handleClose = () => setSidebarOpen(false);

    return (
      <StyledDrawer elementType='nav' isOpen={isSidebarOpen} onClose={handleClose}>
        <Flex direction='column' flex={1} gap='4xl' padding='2xl'>
          <Flex alignItems='center' justifyContent='space-between'>
            <Logo href={RoutesPath.HOME} onPress={handleClose} />
            <Button isIconOnly variant='ghost' onPress={handleClose}>
              <XMark size='s' />
            </Button>
          </Flex>
          <Flex direction='column' flex={1} justifyContent='space-between'>
            <Nav direction='column' gap='3xl'>
              <NavItem href={RoutesPath.BRIDGE}>
                <Trans>Bridge</Trans>
              </NavItem>
              <NavItem href={RoutesPath.APPS}>
                <Trans>Apps</Trans>
              </NavItem>
              <NavItem href={RoutesPath.STAKE}>
                <Trans>Stake</Trans>
              </NavItem>
              <NavItem href={RoutesPath.FUSION}>
                <Trans>Fusion</Trans>
              </NavItem>
              <NavItem isExternal href={ExternalLinks.SAFE}>
                <Trans>Multisig</Trans>
              </NavItem>
              <NavItem isExternal href={ExternalLinks.TERMS_OF_SERVICE}>
                <Trans>T&Cs</Trans>
              </NavItem>
              <NavItem isExternal href={ExternalLinks.DOCS}>
                <Trans>Dev</Trans>
              </NavItem>
              <NavItem isExternal href={ExternalLinks.HOMEPAGE}>
                <Trans>About</Trans>
              </NavItem>
            </Nav>
            <SocialsGroup />
          </Flex>
        </Flex>
      </StyledDrawer>
    );
  }

  return null;
};

export { Sidebar };
