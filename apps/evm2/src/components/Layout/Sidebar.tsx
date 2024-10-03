import { Button, Flex, XMark, useMediaQuery } from '@gobob/ui';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations();
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
              <NavItem href={RoutesPath.BRIDGE}>{t('navigation.bridge')}</NavItem>
              <NavItem href={RoutesPath.WALLET}>{t('navigation.wallet')}</NavItem>
              <NavItem href={RoutesPath.STAKE}>{t('navigation.stake')}</NavItem>
              <NavItem href={RoutesPath.FUSION}>{t('navigation.fusion')}</NavItem>
              <NavItem isExternal href='https://safe.gobob.xyz/welcome'>
                {t('navigation.multisig')}
              </NavItem>
              <NavItem
                isExternal
                href='https://cdn.prod.website-files.com/6620e8932695794632789d89/668eaca0c8c67436ee679ca0_GoBob%20-%20Terms%20of%20Service%20(LW%20draft%207-9)(149414568.5).pdf'
              >
                {t('navigation.t_and_c')}
              </NavItem>
              <NavItem isExternal href={DocsLinks.HOME}>
                {t('navigation.dev')}
              </NavItem>
              <NavItem isExternal href='https://gobob.xyz/'>
                {t('navigation.about')}
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
