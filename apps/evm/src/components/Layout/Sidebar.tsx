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

import { DocsLinks, RoutesPath } from '@/constants';

type Props = { isTestnet?: boolean; isFusion?: boolean };

type SidebarProps = Props;

const Sidebar = ({ isTestnet, isFusion }: SidebarProps): JSX.Element | null => {
  const { isSidebarOpen, setSidebarOpen } = useLayoutContext();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  if (isMobile) {
    const handleClose = () => setSidebarOpen(false);

    return (
      <StyledDrawer elementType='nav' isOpen={isSidebarOpen} onClose={handleClose}>
        <Flex direction='column' flex={1} gap='4xl' padding='2xl'>
          <Flex alignItems='center' justifyContent='space-between'>
            <Logo href={RoutesPath.HOME} isFusion={isFusion} isTestnet={isTestnet} onPress={handleClose} />
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
              <NavItem isExternal href='https://safe.gobob.xyz/welcome'>
                <Trans>Multisig</Trans>
              </NavItem>
              <NavItem
                isExternal
                href='https://cdn.prod.website-files.com/6620e8932695794632789d89/668eaca0c8c67436ee679ca0_GoBob%20-%20Terms%20of%20Service%20(LW%20draft%207-9)(149414568.5).pdf'
              >
                <Trans>T&Cs</Trans>
              </NavItem>
              <NavItem isExternal href={DocsLinks.HOME}>
                <Trans>Dev</Trans>
              </NavItem>
              <NavItem isExternal href='https://gobob.xyz/'>
                <Trans>About</Trans>
              </NavItem>
              <NavItem
                isExternal
                href='https://cdn.prod.website-files.com/6620e8932695794632789d89/675872861db67a29ec01d237_BOB%20Foundation%20-%20Privacy%20Policy.pdf'
                size='s'
              >
                <Trans>Privacy policy</Trans>
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
