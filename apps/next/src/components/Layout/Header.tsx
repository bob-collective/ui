'use client';

import { ConnectWallet } from '@gobob/connect-ui';
import {
  Bars3,
  Button,
  EllipsisHorizontal,
  Flex,
  FlexProps,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useMediaQuery
} from '@gobob/ui';
import { useState } from 'react';
import { useTheme } from 'styled-components';

import { Logo } from '../Logo';
import { SocialsGroup } from '../SocialsGroup';

import { StyledHeader, StyledLogoWrapper } from './Layout.style';
import { useLayoutContext } from './LayoutContext';
import { Nav } from './Nav';
import { NavItem } from './NavItem';

import { RoutesPath } from '@/constants';

type Props = { isTestnet?: boolean; isFusion?: boolean };

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type HeaderProps = Props & InheritAttrs;

const Header = ({ isTestnet, isFusion, ...props }: HeaderProps): JSX.Element => {
  const { setSidebarOpen } = useLayoutContext();
  const [isOpen, setOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <StyledHeader alignItems='center' elementType='header' justifyContent='space-between' {...props}>
      <StyledLogoWrapper alignItems='center' gap='md'>
        {isMobile && (
          <Button isIconOnly aria-label='open drawer' variant='ghost' onPress={() => setSidebarOpen(true)}>
            <Bars3 size='lg' />
          </Button>
        )}
        {!isMobile && <Logo isFusion={isFusion} isTestnet={isTestnet} />}
      </StyledLogoWrapper>
      <Flex alignItems='center' elementType='header' gap='xl' justifyContent='flex-end'>
        {!isMobile && (
          <>
            <Nav>
              <NavItem href={RoutesPath.BRIDGE} size='s'>
                Bridge
              </NavItem>
              <NavItem href={RoutesPath.WALLET} size='s'>
                Wallet
              </NavItem>
              <NavItem href={RoutesPath.FUSION} size='s'>
                Fusion
              </NavItem>
            </Nav>
            <Popover crossOffset={-50} isOpen={isOpen} onOpenChange={setOpen}>
              <PopoverTrigger>
                <Button isIconOnly aria-label='Show secondary navigation' size='s' variant='ghost'>
                  <EllipsisHorizontal color='grey-200' size='s' />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody onClick={() => setOpen(false)}>
                  <Nav direction='column'>
                    <NavItem
                      isExternal
                      href='https://assets-global.website-files.com/64e85c2f3609488b3ed725f4/662a1cdc27ef55b556ce1aa6_GoBob_-_Terms_of_Service.pdf'
                      size='s'
                    >
                      T&Cs
                    </NavItem>
                    <NavItem isExternal href='https://docs.gobob.xyz/' size='s'>
                      Dev
                    </NavItem>
                    <NavItem isExternal href='https://gobob.xyz/' size='s'>
                      About
                    </NavItem>
                    <NavItem isExternal href='https://safe.gobob.xyz/welcome' size='s'>
                      Multisig
                    </NavItem>
                  </Nav>
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <SocialsGroup variant='ghost' />
          </>
        )}
        <ConnectWallet variant='ghost' />
      </Flex>
    </StyledHeader>
  );
};

export { Header };
