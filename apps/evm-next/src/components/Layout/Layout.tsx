'use client';

import { HTMLAttributes } from 'react';

import { StyledLayout } from './Layout.style';
import { LayoutProvider } from './LayoutContext';

type LayoutProps = HTMLAttributes<HTMLDivElement>;

const Layout = ({ children, ...props }: LayoutProps): JSX.Element => {
  return (
    <LayoutProvider>
      <StyledLayout {...props} direction='column'>
        {children}
      </StyledLayout>
    </LayoutProvider>
  );
};

export { Layout };
