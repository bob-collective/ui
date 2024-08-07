import { Flex, FlexProps } from '@gobob/ui';
import { useTranslation } from 'react-i18next';

import { DocsLinks, RoutesPath } from '../../constants';
import { SocialsGroup } from '../SocialsGroup';

import { Nav } from './Nav';
import { NavItem } from './NavItem';

type MobileNavigationProps = FlexProps;

const MobileNavigation = (props: MobileNavigationProps): JSX.Element | null => {
  const { t } = useTranslation();

  return (
    <Flex direction='column' flex={1} justifyContent='space-between' {...props}>
      <Nav direction='column' gap='3xl'>
        <NavItem to={RoutesPath.BRIDGE}>{t('navigation.bridge')}</NavItem>
        <NavItem to={RoutesPath.WALLET}>{t('navigation.wallet')}</NavItem>
        <NavItem to={RoutesPath.FUSION}>{t('navigation.fusion')}</NavItem>
        <NavItem isExternal to='https://safe.gobob.xyz/welcome'>
          {t('navigation.multisig')}
        </NavItem>
        <NavItem
          isExternal
          to='https://cdn.prod.website-files.com/6620e8932695794632789d89/668eaca0c8c67436ee679ca0_GoBob%20-%20Terms%20of%20Service%20(LW%20draft%207-9)(149414568.5).pdf'
        >
          {t('navigation.t_and_c')}
        </NavItem>
        <NavItem isExternal to={DocsLinks.HOME}>
          {t('navigation.dev')}
        </NavItem>
        <NavItem isExternal to='https://gobob.xyz/'>
          {t('navigation.about')}
        </NavItem>
      </Nav>
      <SocialsGroup />
    </Flex>
  );
};

export { MobileNavigation };
