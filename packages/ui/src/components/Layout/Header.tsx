import { ReactNode } from 'react';

import { Bars3 } from '../../icons';
import { Button } from '../Button';
import { Flex, FlexProps } from '../Flex';
import { Link } from '../Link';

import { StyledHeader, StyledLogoWrapper } from './Layout.style';
import { useLayoutContext } from './LayoutContext';
import { Sidebar, SidebarProps } from './Sidebar';

type Props = { logo: ReactNode; logoHref: string; withSidebar?: boolean; sidebarProps?: Omit<SidebarProps, 'logo'> };

type InheritAttrs = Omit<FlexProps, keyof Props>;

type HeaderProps = Props & InheritAttrs;

const Header = ({
  withSidebar,
  children,
  logoHref,
  logo: logoProp,
  sidebarProps,
  ...props
}: HeaderProps): JSX.Element => {
  const { setSidebarOpen } = useLayoutContext();

  const logo = (
    <Link href={logoHref} onPress={() => setSidebarOpen(false)}>
      {logoProp}
    </Link>
  );

  return (
    <>
      <StyledHeader alignItems='center' elementType='header' justifyContent='space-between' {...props}>
        <StyledLogoWrapper alignItems='center' gap='md'>
          {withSidebar ? (
            <Button isIconOnly aria-label='open drawer' variant='ghost' onPress={() => setSidebarOpen(true)}>
              <Bars3 size='lg' />
            </Button>
          ) : (
            logo
          )}
        </StyledLogoWrapper>
        <Flex alignItems='center' elementType='header' gap='xl' justifyContent='flex-end'>
          {children}
        </Flex>
      </StyledHeader>
      {withSidebar && <Sidebar {...sidebarProps} logo={logo} />}
    </>
  );
};

export { Header };
