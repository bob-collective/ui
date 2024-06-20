import { ReactNode } from 'react';
import { MaxWidth, ResponsiveProp, Spacing } from '@gobob/ui';

import { StyledContent, StyledMain } from './Layout.style';

type Props = {
  maxWidth?: ResponsiveProp<MaxWidth>;
  padding?: Spacing;
  children: ReactNode;
  hasBackgroundImg?: boolean;
};

type MainProps = Props;

const Main = ({ children, maxWidth, padding = '4xl', hasBackgroundImg, ...props }: MainProps): JSX.Element => (
  <StyledMain $maxWidth={maxWidth} $padding={padding} {...props}>
    {/* {hasBackgroundImg && <StyledBackground alt='background' src={bgSrc} />} */}
    <StyledContent>{children}</StyledContent>
  </StyledMain>
);

export { Main };
