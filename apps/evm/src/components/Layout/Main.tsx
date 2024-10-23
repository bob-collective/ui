import { ReactNode } from 'react';
import { MaxWidth, ResponsiveProp, Spacing } from '@gobob/ui';

import { StyledBackground, StyledContent, StyledMain } from './Layout.style';

import spiceMachine from '@public/assets/spice-machine-opacity.jpg';

type Props = {
  maxWidth?: ResponsiveProp<MaxWidth>;
  padding?: Spacing;
  children: ReactNode;
  hasBackgroundImg?: boolean;
};

type MainProps = Props;

const Main = ({ children, maxWidth, padding = '4xl', hasBackgroundImg, ...props }: MainProps): JSX.Element => (
  <StyledMain $maxWidth={maxWidth} $padding={padding} {...props}>
    {hasBackgroundImg && (
      <StyledBackground alt='background' height='876' src={spiceMachine} width='1440' placeholder='blur' />
    )}
    <StyledContent>{children}</StyledContent>
  </StyledMain>
);

export { Main };
