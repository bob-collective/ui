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
import { useTranslation } from 'next-i18next';
import { useTheme } from 'styled-components';

import { Logo } from '../Logo';
import { SocialsGroup } from '../SocialsGroup';

import { StyledHeader, StyledLogoWrapper } from './Layout.style';
import { useLayoutContext } from './LayoutContext';
import { Nav } from './Nav';
import { NavItem } from './NavItem';

import { DocsLinks, RoutesPath } from '@/constants';

type Props = { isTestnet?: boolean; isFusion?: boolean };

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type HeaderProps = Props & InheritAttrs;

const Header = ({ isTestnet, isFusion, ...props }: HeaderProps): JSX.Element => {
  const { setSidebarOpen } = useLayoutContext();
  const [isOpen, setOpen] = useState(false);

  const { t } = useTranslation();
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
        {!isMobile && <Logo href={RoutesPath.HOME} isFusion={isFusion} isTestnet={isTestnet} />}
      </StyledLogoWrapper>
      <Flex alignItems='center' elementType='header' gap='xl' justifyContent='flex-end'>
        {!isMobile && (
          <>
            <Nav>
              <NavItem href={RoutesPath.BRIDGE} size='s'>
                {t('navigation.bridge')}
              </NavItem>
              <NavItem href={RoutesPath.WALLET} size='s'>
                {t('navigation.wallet')}
              </NavItem>
              <NavItem href={RoutesPath.STAKE} size='s'>
                {t('navigation.stake')}
              </NavItem>
              <NavItem href={RoutesPath.FUSION} size='s'>
                {t('navigation.fusion')}
              </NavItem>
            </Nav>
            <Popover crossOffset={-50} isOpen={isOpen} onOpenChange={setOpen}>
              <PopoverTrigger>
                <Button isIconOnly aria-label='Show secondary navigation' size='s' variant='ghost'>
                  <EllipsisHorizontal color='light' size='s' />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody onClick={() => setOpen(false)}>
                  <Nav direction='column'>
                    <NavItem
                      isExternal
                      href='https://cdn.prod.website-files.com/6620e8932695794632789d89/668eaca0c8c67436ee679ca0_GoBob%20-%20Terms%20of%20Service%20(LW%20draft%207-9)(149414568.5).pdf'
                      size='s'
                    >
                      {t('navigation.t_and_c')}
                    </NavItem>
                    <NavItem isExternal href={DocsLinks.HOME} size='s'>
                      {t('navigation.dev')}
                    </NavItem>
                    <NavItem isExternal href='https://gobob.xyz/' size='s'>
                      {t('navigation.about')}
                    </NavItem>
                    <NavItem isExternal href='https://safe.gobob.xyz/welcome' size='s'>
                      {t('navigation.multisig')}
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
