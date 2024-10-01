import { Flex, FlexProps, P } from '@gobob/ui';
import { useTranslation } from 'react-i18next';

import { LoginButton } from '../LoginButton';

type Props = { onLogin?: () => void };

type InheritAttrs = Omit<FlexProps, keyof Props>;

type LoginSectionProps = Props & InheritAttrs;

const LoginSection = ({
  direction = { base: 'column', md: 'row' },
  onLogin,
  ...props
}: LoginSectionProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Flex alignItems='center' direction={direction} gap='xs' justifyContent='center' {...props}>
      <P size='s' weight='bold'>
        {t('home.loginLabel')}
      </P>
      <LoginButton color='primary' size='s' variant='ghost' onLogin={onLogin}>
        {t('home.loginButtonText')}
      </LoginButton>
    </Flex>
  );
};

export { LoginSection };
