import { Flex, Span } from '@gobob/ui';
import { BOBLogo } from '@gobob/icons';
import { LinkProps } from 'next/link';

import { StyledBadge, StyledLogo } from './Logo.style';

type Props = {
  isTestnet?: boolean;
  isFusion?: boolean;
  onPress?: () => void;
};

type InheritAttrs = Omit<LinkProps, keyof Props | 'children'>;

type LogoProps = Props & InheritAttrs;

const Logo = ({ isTestnet, isFusion, href = '/', onPress, ...props }: LogoProps) => (
  <Flex alignItems='center' gap='s'>
    <StyledLogo
      {...(props as any)}
      aria-label='navigate to home page'
      href={href}
      onClick={onPress}
      onKeyDown={onPress}
    >
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
