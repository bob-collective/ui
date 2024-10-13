import { Flex, Span } from '@gobob/ui';
import { BOBLogo } from '@gobob/icons';
import { LinkProps } from 'next/link';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { StyledBadge, StyledLogo } from './Logo.style';

type Props = {
  isTestnet?: boolean;
  isFusion?: boolean;
  onPress?: () => void;
  hidden?: boolean;
};

type InheritAttrs = Omit<LinkProps, keyof Props | 'children'>;

type LogoProps = Props & InheritAttrs;

const Logo = ({ isTestnet, isFusion, href = '/', onPress, hidden, ...props }: LogoProps) => {
  const { i18n } = useLingui();

  return (
    <Flex alignItems='center' gap='s' hidden={hidden}>
      <StyledLogo
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(props as any)}
        aria-label={t(i18n)`navigate to home page`}
        href={href}
        onClick={onPress}
        onKeyDown={onPress}
      >
        <BOBLogo size='xl' />
        <Span size='xl' weight='bold'>
          <Trans>BOB</Trans>
        </Span>
        {isFusion && (
          <Span color='primary-500' fontFamily='eurostar' size='xl' weight='bold'>
            <Trans>FUSION</Trans>
          </Span>
        )}
      </StyledLogo>
      {isTestnet && (
        <StyledBadge size='xs' weight='semibold'>
          <Trans>Testnet</Trans>
        </StyledBadge>
      )}
    </Flex>
  );
};

export { Logo };
