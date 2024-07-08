import { ReactNode } from 'react';
import { MaxWidth, ResponsiveProp, Spacing } from '@gobob/ui';

import { StyledContent, StyledMain } from './Layout.style';

type Props = {
  maxWidth?: ResponsiveProp<MaxWidth>;
  padding?: Spacing;
  children: ReactNode;
};

type MainProps = Props;

const Main = ({ children, maxWidth, padding = '4xl', ...props }: MainProps): JSX.Element => (
  <StyledMain $maxWidth={maxWidth} $padding={padding} {...props}>
    <StyledContent>{children}</StyledContent>
  </StyledMain>
);

export { Main };
