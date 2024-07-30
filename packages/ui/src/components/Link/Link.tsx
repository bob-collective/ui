import { AriaLinkOptions, useLink } from '@react-aria/link';
import { mergeProps } from '@react-aria/utils';
import { AnchorHTMLAttributes, forwardRef } from 'react';

import { useDOMRef } from '../../hooks';
import { Color } from '../../theme';
import { TextProps } from '../Text';
import { mapTextProps } from '../Text/utils';

import { StyledLink, StyledIcon } from './Link.style';

type Props = {
  color?: Color;
  external?: boolean;
  underlined?: 'none' | 'hover' | 'always';
  icon?: boolean;
};

type AriaAttrs = Omit<AriaLinkOptions, keyof Props>;

type NativeAttrs = Omit<AnchorHTMLAttributes<unknown>, keyof Props & AriaAttrs>;

type InheritAttrs = Omit<TextProps, keyof Props & AriaAttrs & NativeAttrs>;

type LinkProps = Props & NativeAttrs & InheritAttrs & AriaAttrs;

// TODO: add missing colors to button and allow Link component to work through system using react router
const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ color = 'light', external, underlined = 'none', icon, children, href, className, ...props }, ref): JSX.Element => {
    const linkRef = useDOMRef(ref);

    const elementType = href ? 'a' : 'span';

    const externalProps = external ? { target: '_blank', rel: 'noreferrer' } : undefined;

    const ariaProps = {
      ...props,
      ...externalProps,
      href,
      elementType
    };

    const { linkProps } = useLink(ariaProps, linkRef);

    return (
      <StyledLink
        ref={linkRef}
        $underlined={href ? underlined : 'none'}
        as={elementType}
        className={className}
        color={color}
        {...mergeProps(linkProps, externalProps, mapTextProps(props))}
      >
        {children}
        {icon && <StyledIcon color='inherit' height='1em' width='1em' />}
      </StyledLink>
    );
  }
);

Link.displayName = 'Link';

export { Link };
export type { LinkProps };
