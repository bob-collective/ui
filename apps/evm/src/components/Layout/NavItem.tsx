'use client';

import { Flex, Span, TextProps } from '@gobob/ui';
import { ReactNode, useRef } from 'react';
import { LinkProps } from 'next/link';
import { ArrowTopRightOnSquare } from '@gobob/ui';
import { useParams, usePathname } from 'next/navigation';

import { StyledAnchor, StyledNativeNavLink, StyledNavLink } from './Layout.style';

type Props = {
  children: ReactNode;
  size?: TextProps['size'];
  isExternal?: boolean;
  onPress?: () => void;
};

type InheritAttrs = Omit<LinkProps, keyof Props>;

type NavItemProps = Props & InheritAttrs;

const NavItem = ({ children, size, isExternal, href, onPress, ...props }: NavItemProps): JSX.Element => {
  const ref = useRef(null);
  const pathname = usePathname();
  const params = useParams();

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
              onClick={onPress}
              onKeyDown={onPress}
            >
              {children}
            </StyledAnchor>
            <ArrowTopRightOnSquare size='xs' />
          </Flex>
        </StyledNavLink>
      </li>
    );
  }

  const localizedHref = `/${params.lang}${href}`;

  return (
    <li>
      <StyledNativeNavLink {...props} ref={ref} href={localizedHref} onClick={onPress} onKeyDown={onPress}>
        <StyledNavLink
          as={Span}
          color={pathname === localizedHref ? 'primary-500' : 'light'}
          size={size}
          weight='medium'
        >
          {children}
        </StyledNavLink>
      </StyledNativeNavLink>
    </li>
  );
};

export { NavItem };
