import { Flex, Span, TextProps } from '@gobob/ui';
import { ReactNode } from 'react';
import { ArrowTopRightOnSquare } from '@gobob/ui';
import { usePathname } from 'next/navigation';
import Link, { LinkProps } from 'next/link';

import { StyledAnchor, StyledNavLink } from './Layout.style';

import { useLayoutContext } from '.';

type Props = {
  children: ReactNode;
  size?: TextProps['size'];
  isExternal?: boolean;
};

type InheritAttrs = Omit<LinkProps, keyof Props>;

type NavItemProps = Props & InheritAttrs;

const NavItem = ({ children, size, isExternal, href, ...props }: NavItemProps): JSX.Element => {
  const { setSidebarOpen } = useLayoutContext();
  const pathname = usePathname();

  const handlePress = () => setSidebarOpen(false);

  if (isExternal) {
    return (
      <li>
        <StyledNavLink color='light' size={size} weight='medium'>
          <Flex alignItems='center' direction='row' elementType='span' gap='s'>
            <StyledAnchor
              {...(props as any)}
              href={href}
              rel='noreferrer'
              target='_blank'
              onClick={handlePress}
              onKeyDown={handlePress}
            >
              {children}
            </StyledAnchor>
            <ArrowTopRightOnSquare size='xs' />
          </Flex>
        </StyledNavLink>
      </li>
    );
  }

  return (
    <li>
      <Link {...props} passHref href={href} onClick={handlePress} onKeyDown={handlePress}>
        <StyledNavLink as={Span} color={href === pathname ? 'primary-500' : 'light'} size={size} weight='medium'>
          {children}
        </StyledNavLink>
      </Link>
    </li>
  );
};

export { NavItem };
