'use client';

import { AriaBreadcrumbItemProps, useBreadcrumbItem } from '@react-aria/breadcrumbs';
import { mergeProps } from '@react-aria/utils';
import { AnchorHTMLAttributes, Fragment, useRef } from 'react';

import { ChevronRight } from '../../icons';
import { LinkProps } from '../Link';

import { StyledLinkBreadcrumb, StyledSpanBreadcrumb } from './Breadcrumbs.style';

type Props = {
  isDisabled?: boolean;
  isCurrent: boolean;
};

type InheritAttrs = Omit<AriaBreadcrumbItemProps, keyof Props>;

type NativeAttrs = Omit<AnchorHTMLAttributes<unknown>, keyof (Props & InheritAttrs)>;

type BreadcrumbItemProps = Props & NativeAttrs & InheritAttrs;

const BreadcrumbItem = ({ children, isDisabled, isCurrent, href, ...props }: BreadcrumbItemProps): JSX.Element => {
  const ref = useRef(null);
  const { itemProps } = useBreadcrumbItem(
    {
      ...props,
      children,
      isDisabled: isCurrent,
      elementType: isCurrent ? 'span' : 'a'
    },
    ref
  );

  const commonProps: Pick<LinkProps, 'size' | 'color'> = {
    size: 's',
    color: isCurrent ? 'light' : 'green-300'
  };

  return (
    <Fragment>
      {isCurrent ? (
        <StyledSpanBreadcrumb ref={ref} {...mergeProps(commonProps, itemProps)}>
          {children}
        </StyledSpanBreadcrumb>
      ) : (
        <StyledLinkBreadcrumb
          ref={ref}
          $isDisabled={isDisabled}
          href={href}
          {...mergeProps(commonProps, itemProps as any)}
        >
          {children}
        </StyledLinkBreadcrumb>
      )}
      {isCurrent === false && <ChevronRight color='green-300' size='xs' />}
    </Fragment>
  );
};

export { BreadcrumbItem };
export type { BreadcrumbItemProps };
