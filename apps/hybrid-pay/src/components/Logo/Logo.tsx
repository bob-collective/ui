import { Flex, Span } from '@gobob/ui';
import { BOBLogo } from '@gobob/icons';
import { NavLinkProps } from 'react-router-dom';

import { StyledBadge, StyledLogo } from './Logo.style';

type Props = {
  isTestnet?: boolean;
  isFusion?: boolean;
  onPress?: () => void;
  to?: string;
};

type InheritAttrs = Omit<NavLinkProps, keyof Props | 'children'>;

type LogoProps = Props & InheritAttrs;

const Logo = ({ isTestnet, isFusion, to = '/', onPress, ...props }: LogoProps) => (
  <Flex alignItems='center' gap='s'>
    <StyledLogo {...(props as any)} aria-label='navigate to home page' to={to} onClick={onPress} onKeyDown={onPress}>
      <BOBLogo size='xl' />
      <Span size='xl' weight='bold'>
        BOB
      </Span>
      {isFusion && (
        <Span color='primary-500' fontFamily='eurostar' size='xl' weight='bold'>
          FUSION
        </Span>
      )}
    </StyledLogo>
    {isTestnet && (
      <StyledBadge size='xs' weight='semibold'>
        Testnet
      </StyledBadge>
    )}
  </Flex>
);

export { Logo };
