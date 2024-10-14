'use client';

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
import { Trans } from '@lingui/macro';
import { useState } from 'react';
import { useTheme } from 'styled-components';

import { Logo } from '../Logo';
import { SocialsGroup } from '../SocialsGroup';

import { FusionPopover } from './FusionPopover';
import { StyledHeader, StyledLogoWrapper } from './Layout.style';
import { useLayoutContext } from './LayoutContext';
import { Nav } from './Nav';
import { NavItem } from './NavItem';

import { ConnectWallet } from '@/connect-ui';
import { FeatureFlags, useFeatureFlag } from '@/hooks';
import { DocsLinks, RoutesPath } from '@/constants';
import { useUserAgent } from '@/user-agent';

type Props = { isTestnet?: boolean; isFusion?: boolean };

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type HeaderProps = Props & InheritAttrs;

const Header = ({ isTestnet, isFusion, ...props }: HeaderProps): JSX.Element => {
  const { setSidebarOpen } = useLayoutContext();
  const [isOpen, setOpen] = useState(false);

  const theme = useTheme();
  const isMobileViewport = useMediaQuery(theme.breakpoints.down('md'));
  const { isMobile: isMobileUserAgent } = useUserAgent();
  const isWalletEnabled = useFeatureFlag(FeatureFlags.WALLET);

  const isMobile = isMobileViewport || isMobileUserAgent;

  return (
    <StyledHeader alignItems='center' elementType='header' justifyContent='space-between' {...props}>
      <StyledLogoWrapper alignItems='center' gap='md'>
        <Button
          isIconOnly
          aria-label='open drawer'
          hidden={!isMobile}
          variant='ghost'
          onPress={() => setSidebarOpen(true)}
        >
          <Bars3 size='lg' />
        </Button>
        <Logo hidden={isMobile} href={RoutesPath.HOME} isFusion={isFusion} isTestnet={isTestnet} />
      </StyledLogoWrapper>
      <Flex alignItems='center' elementType='header' gap='xl' justifyContent='flex-end'>
        <Nav hidden={isMobile}>
          <NavItem href={RoutesPath.BRIDGE} size='s'>
            <Trans>Bridge</Trans>
          </NavItem>
          <NavItem href={RoutesPath.APPS} size='s'>
            <Trans>Apps</Trans>
          </NavItem>
          {isWalletEnabled && (
            <NavItem href={RoutesPath.WALLET} size='s'>
              <Trans>Wallet</Trans>
            </NavItem>
          )}
          <NavItem href={RoutesPath.STAKE} size='s'>
            <Trans>Stake</Trans>
          </NavItem>
          <NavItem href={RoutesPath.FUSION} size='s'>
            <Trans>Fusion</Trans>
          </NavItem>
        </Nav>
        <Popover crossOffset={-50} isOpen={isOpen} onOpenChange={setOpen}>
          <PopoverTrigger>
            <Button isIconOnly aria-label='Show secondary navigation' hidden={isMobile} size='s' variant='ghost'>
              <EllipsisHorizontal color='light' size='s' />
            </Button>
          </PopoverTrigger>
          <PopoverContent hidden={isMobile}>
            <PopoverBody onClick={() => setOpen(false)}>
              <Nav direction='column'>
                <NavItem
                  isExternal
                  href='https://cdn.prod.website-files.com/6620e8932695794632789d89/668eaca0c8c67436ee679ca0_GoBob%20-%20Terms%20of%20Service%20(LW%20draft%207-9)(149414568.5).pdf'
                  size='s'
                >
                  <Trans>T&Cs</Trans>
                </NavItem>
                <NavItem isExternal href={DocsLinks.HOME} size='s'>
                  <Trans>Dev</Trans>
                </NavItem>
                <NavItem isExternal href='https://gobob.xyz/' size='s'>
                  <Trans>About</Trans>
                </NavItem>
                <NavItem isExternal href='https://safe.gobob.xyz/welcome' size='s'>
                  <Trans>Multisig</Trans>
                </NavItem>
              </Nav>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <SocialsGroup hidden={isMobile} variant='ghost' />
        <FusionPopover />
        <ConnectWallet variant='ghost' />
      </Flex>
    </StyledHeader>
  );
};

export { Header };
