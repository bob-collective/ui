import { Flex, FlexProps, P } from '@gobob/ui';
import { useTranslations } from 'next-intl';

import { LoginButton } from '../LoginButton';

type Props = {};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type LoginSectionProps = Props & InheritAttrs;

const LoginSection = ({ direction = { base: 'column', md: 'row' }, ...props }: LoginSectionProps): JSX.Element => {
  const t = useTranslations();

  return (
    <Flex alignItems='center' direction={direction} gap='xs' justifyContent='center' {...props}>
      <P size='s' weight='bold'>
        {t('home.loginLabel')}
      </P>
      <LoginButton color='primary' size='s' variant='ghost'>
        {t('home.loginButtonText')}
      </LoginButton>
    </Flex>
  );
};

export { LoginSection };
