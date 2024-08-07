import { ReactNode } from 'react';

import { MaxWidth, ResponsiveProp, Spacing } from '../../theme';

import { StyledMain } from './Layout.style';

type Props = {
  maxWidth?: ResponsiveProp<MaxWidth>;
  padding?: Spacing;
  children: ReactNode;
};

type MainProps = Props;

const Main = ({ children, maxWidth, padding = '4xl', ...props }: MainProps): JSX.Element => (
  <StyledMain $maxWidth={maxWidth} $padding={padding} {...props}>
    {children}
  </StyledMain>
);

export { Main };
