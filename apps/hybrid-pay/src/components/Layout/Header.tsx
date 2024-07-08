import { Bars3, Button, Flex, FlexProps, useMediaQuery } from '@gobob/ui';
import { useTheme } from 'styled-components';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';

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
      <Flex alignItems='center' elementType='nav' gap='xl' justifyContent='flex-end'>
        {!isMobile && (
          <>
            <Nav>
              <NavItem size='s' to={RoutesPath.HOME}>
                Home
              </NavItem>
            </Nav>
            <SocialsGroup variant='ghost' />
          </>
        )}
        <DynamicWidget />
      </Flex>
    </StyledHeader>
  );
};

export { Header };
