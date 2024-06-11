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
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import { RoutesPath } from '../../constants';
import { Logo } from '../Logo';
import { SocialsGroup } from '../SocialsGroup';

import { StyledHeader, StyledLogoWrapper } from './Layout.style';
import { useLayoutContext } from './LayoutContext';
import { Nav } from './Nav';
import { NavItem } from './NavItem';

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
        {!isMobile && <Logo isFusion={isFusion} isTestnet={isTestnet} />}
      </StyledLogoWrapper>
      <Flex alignItems='center' elementType='header' gap='xl' justifyContent='flex-end'>
        {!isMobile && (
          <>
            <Nav>
              <NavItem size='s' to={RoutesPath.BRIDGE}>
                {t('navigation.bridge')}
              </NavItem>
              <NavItem size='s' to={RoutesPath.WALLET}>
                {t('navigation.wallet')}
              </NavItem>
              <NavItem size='s' to={RoutesPath.FUSION}>
                {t('navigation.fusion')}
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
                      size='s'
                      to='https://assets-global.website-files.com/64e85c2f3609488b3ed725f4/662a1cdc27ef55b556ce1aa6_GoBob_-_Terms_of_Service.pdf'
                    >
                      {t('navigation.t_and_c')}
                    </NavItem>
                    <NavItem isExternal size='s' to='https://docs.gobob.xyz/'>
                      {t('navigation.dev')}
                    </NavItem>
                    <NavItem isExternal size='s' to='https://gobob.xyz/'>
                      {t('navigation.about')}
                    </NavItem>
                    <NavItem isExternal size='s' to='https://safe.gobob.xyz/welcome'>
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
