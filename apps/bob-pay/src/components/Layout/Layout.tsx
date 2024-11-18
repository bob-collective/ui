import { HTMLAttributes } from 'react';

import { StyledLayout } from './Layout.style';

type LayoutProps = HTMLAttributes<unknown>;

const Layout = ({ children, ...props }: LayoutProps): JSX.Element => {
  return (
    <StyledLayout {...props} direction='column'>
      {children}
    </StyledLayout>
  );
};

export { Layout };
