import { Em, Flex, Span } from '@gobob/ui';
import { BOBLogo } from '@gobob/icons';
import { NavLinkProps } from 'react-router-dom';

import { StyledLogo } from './Logo.style';

type Props = {
  onPress?: () => void;
  to?: string;
};

type InheritAttrs = Omit<NavLinkProps, keyof Props | 'children'>;

type LogoProps = Props & InheritAttrs;

const Logo = ({ to = '/', onPress, ...props }: LogoProps) => (
  <Flex alignItems='center' gap='s'>
    <StyledLogo {...(props as any)} aria-label='navigate to home page' to={to} onClick={onPress} onKeyDown={onPress}>
      <BOBLogo size='xl' />
      <Span size='xl' weight='bold'>
        BOB
      </Span>
      <Em color='primary-500' size='xl' weight='bold'>
        PAY
      </Em>
    </StyledLogo>
  </Flex>
);

export { Logo };
