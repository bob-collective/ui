import { Flex, Span, TextProps } from '@gobob/ui';
import { ReactNode, useRef } from 'react';
import { NavLinkProps } from 'react-router-dom';
import { ArrowTopRightOnSquare } from '@gobob/ui';

import { StyledAnchor, StyledNativeNavLink, StyledNavLink } from './Layout.style';

import { useLayoutContext } from '.';

type Props = {
  children: ReactNode;
  size?: TextProps['size'];
  isExternal?: boolean;
};

type InheritAttrs = Omit<NavLinkProps, keyof Props>;

type NavItemProps = Props & InheritAttrs;

const NavItem = ({ children, size, isExternal, to, ...props }: NavItemProps): JSX.Element => {
  const ref = useRef(null);
  const { setSidebarOpen } = useLayoutContext();

  const handlePress = () => setSidebarOpen(false);

  if (isExternal) {
    return (
      <li>
        <StyledNavLink color='light' size={size} weight='medium'>
          <Flex alignItems='center' direction='row' elementType='span' gap='s'>
            <StyledAnchor
              {...(props as any)}
              ref={ref}
              href={to}
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
      <StyledNativeNavLink {...props} ref={ref} to={to} onClick={handlePress} onKeyDown={handlePress}>
        {({ isActive }) => (
          <StyledNavLink as={Span} color={isActive ? 'primary-500' : 'light'} size={size} weight='medium'>
            {children}
          </StyledNavLink>
        )}
      </StyledNativeNavLink>
    </li>
  );
};

export { NavItem };
