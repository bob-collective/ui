'use client';

import { Flex, Span, TextProps } from '@gobob/ui';
import { ReactNode, useRef } from 'react';
import { LinkProps } from 'next/link';
import { ArrowTopRightOnSquare } from '@gobob/ui';
import { usePathname } from 'next/navigation';

import { StyledAnchor, StyledNativeNavLink, StyledNavLink } from './Layout.style';

import { useLayoutContext } from '.';

type Props = {
  children: ReactNode;
  size?: TextProps['size'];
  isExternal?: boolean;
};

type InheritAttrs = Omit<LinkProps, keyof Props>;

type NavItemProps = Props & InheritAttrs;

const NavItem = ({ children, size, isExternal, href, ...props }: NavItemProps): JSX.Element => {
  const ref = useRef(null);
  const { setSidebarOpen } = useLayoutContext();
  const pathname = usePathname();

  const handlePress = () => setSidebarOpen(false);

  if (isExternal) {
    return (
      <li>
        <StyledNavLink color='light' size={size} weight='medium'>
          <Flex alignItems='center' direction='row' elementType='span' gap='s'>
            <StyledAnchor
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              {...(props as any)}
              ref={ref}
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
      <StyledNativeNavLink {...props} ref={ref} href={href} onClick={handlePress} onKeyDown={handlePress}>
        <StyledNavLink as={Span} color={pathname === href ? 'primary-500' : 'light'} size={size} weight='medium'>
          {children}
        </StyledNavLink>
      </StyledNativeNavLink>
    </li>
  );
};

export { NavItem };
