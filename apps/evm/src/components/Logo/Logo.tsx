import { Flex, Span } from '@gobob/ui';
import { BOBLogo } from '@gobob/icons';
import { LinkProps } from 'next/link';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useParams } from 'next/navigation';

import { StyledLogo } from './Logo.style';

type Props = {
  onPress?: () => void;
  hidden?: boolean;
};

type InheritAttrs = Omit<LinkProps, keyof Props | 'children'>;

type LogoProps = Props & InheritAttrs;

const Logo = ({ href = '/', onPress, hidden, ...props }: LogoProps) => {
  const { i18n } = useLingui();
  const params = useParams();

  return (
    <Flex alignItems='center' gap='s' hidden={hidden}>
      <StyledLogo
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(props as any)}
        aria-label={t(i18n)`navigate to home page`}
        href={`/${params.lang}${href}`}
        onClick={onPress}
        onKeyDown={onPress}
      >
        <BOBLogo size='xl' />
        <Span size='xl' weight='bold'>
          <Trans>BOB</Trans>
        </Span>
      </StyledLogo>
    </Flex>
  );
};

export { Logo };
