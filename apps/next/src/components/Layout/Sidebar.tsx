'use client';

import { Button, Flex, XMark, useMediaQuery } from '@gobob/ui';
import { useTheme } from 'styled-components';

import { Logo } from '../Logo';
import { SocialsGroup } from '../SocialsGroup';

import { StyledDrawer } from './Layout.style';
import { useLayoutContext } from './LayoutContext';
import { Nav } from './Nav';
import { NavItem } from './NavItem';

import { RoutesPath } from '@/constants';

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
            <Logo isFusion={isFusion} isTestnet={isTestnet} onPress={handleClose} />
            <Button isIconOnly variant='ghost' onPress={handleClose}>
              <XMark size='s' />
            </Button>
          </Flex>
          <Flex direction='column' flex={1} justifyContent='space-between'>
            <Nav direction='column' gap='3xl'>
              <NavItem href={RoutesPath.BRIDGE}>Bridge</NavItem>
              <NavItem href={RoutesPath.WALLET}>Wallet</NavItem>
              <NavItem href={RoutesPath.FUSION}>Fusion</NavItem>
              <NavItem isExternal href='https://safe.gobob.xyz/welcome'>
                Multisig
              </NavItem>
              <NavItem
                isExternal
                href='https://assets-global.website-files.com/64e85c2f3609488b3ed725f4/662a1cdc27ef55b556ce1aa6_GoBob_-_Terms_of_Service.pdf'
              >
                T&Cs
              </NavItem>
              <NavItem isExternal href='https://docs.gobob.xyz/'>
                Dev
              </NavItem>
              <NavItem isExternal href='https://gobob.xyz/'>
                About
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
