'use client';

import {
  Button,
  EllipsisHorizontal,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useMediaQuery
} from '@gobob/ui';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useState } from 'react';
import { useTheme } from 'styled-components';

import { ConnectButton } from '../ConnectButton';
import { Logo } from '../Logo';
import { SocialsGroup } from '../SocialsGroup';

import { FusionPopover } from './FusionPopover';
import { StyledHeader, StyledLogoWrapper } from './Layout.style';
import { Nav } from './Nav';
import { NavItem } from './NavItem';
import { Sidebar } from './Sidebar';

import { ExternalLinks, RoutesPath } from '@/constants';
import { useUserAgent } from '@/user-agent';

const Header = (): JSX.Element => {
  const { i18n } = useLingui();

  const [isPopoverOpen, setPopoverOpen] = useState(false);

  const theme = useTheme();
  const isMobileViewport = useMediaQuery(theme.breakpoints.down('md'));
  const { isMobile: isMobileUserAgent } = useUserAgent();

  const isMobile = isMobileViewport || isMobileUserAgent;

  return (
    <StyledHeader alignItems='center' elementType='header' justifyContent='space-between'>
      <Flex alignItems='center' gap='4xl'>
        <StyledLogoWrapper alignItems='center' gap='md'>
          <Sidebar isMobile={isMobile} />
          <Logo hidden={isMobile} href={RoutesPath.HOME} />
        </StyledLogoWrapper>
        <Flex alignItems='center' gap='xl'>
          <Nav hidden={isMobile}>
            <NavItem href={RoutesPath.BRIDGE} size='s'>
              <Trans>Bridge</Trans>
            </NavItem>
            <NavItem href={RoutesPath.APPS} size='s'>
              <Trans>Apps</Trans>
            </NavItem>
            <NavItem href={RoutesPath.STRATEGIES} size='s'>
              <Trans>Stake</Trans>
            </NavItem>
            <NavItem href={RoutesPath.FUSION} size='s'>
              <Trans>Fusion</Trans>
            </NavItem>
          </Nav>
          <Popover crossOffset={-50} isOpen={isPopoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger>
              <Button
                isIconOnly
                aria-label={t(i18n)`Show secondary navigation`}
                hidden={isMobile}
                size='s'
                variant='ghost'
              >
                <EllipsisHorizontal color='light' size='s' />
              </Button>
            </PopoverTrigger>
            <PopoverContent hidden={isMobile}>
              <PopoverBody gap='md' onClick={() => setPopoverOpen(false)}>
                <Nav direction='column'>
                  <NavItem isExternal href={ExternalLinks.TERMS_OF_SERVICE} size='s'>
                    <Trans>T&Cs</Trans>
                  </NavItem>
                  <NavItem isExternal href={ExternalLinks.DOCS} size='s'>
                    <Trans>Dev</Trans>
                  </NavItem>
                  <NavItem isExternal href={ExternalLinks.HOMEPAGE} size='s'>
                    <Trans>About</Trans>
                  </NavItem>
                  <NavItem isExternal href={ExternalLinks.SAFE} size='s'>
                    <Trans>Multisig</Trans>
                  </NavItem>
                </Nav>
                <SocialsGroup hidden={isMobile} variant='ghost' />
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Flex>
      </Flex>
      <Flex alignItems='center' gap='xl'>
        <FusionPopover />
        <ConnectButton />
      </Flex>
    </StyledHeader>
  );
};

export { Header };
