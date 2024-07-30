import { HTMLAttributes } from 'react';

import { StyledLayout } from './Layout.style';

type Props = {};

type NattiveAttrs = Omit<HTMLAttributes<unknown>, keyof Props>;

type LayoutProps = Props & NattiveAttrs;

const Layout = ({ children, ...props }: LayoutProps): JSX.Element => {
  return (
    <StyledLayout {...props} direction='column'>
      {children}
    </StyledLayout>
  );
};

export { Layout };
