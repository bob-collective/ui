import { Button, Divider, Flex, H2, P } from '@gobob/ui';
import { Link } from '@gobob/ui';
import { useTranslation } from 'next-i18next';

import { LoginSection } from '@/components';
import { RoutesPath } from '@/constants';

const LoginSignUp = () => {
  const { t } = useTranslation();

  return (
    <Flex direction='column' flex={1} gap='2xl' justifyContent='space-between'>
      <Flex direction='column' gap='md'>
        <H2 size='md'>{t('fusion.logIn.title')}</H2>
        <Divider />
        <P color='grey-50' size='s'>
          {t('fusion.logIn.content')}
        </P>
      </Flex>
      <Flex direction='column' gap='md' paddingX='lg' paddingY='md'>
        <Button asChild color='primary' size='xl'>
          <Link href={RoutesPath.SIGN_UP}>{t('fusion.logIn.label')}</Link>
        </Button>
        <LoginSection />
      </Flex>
    </Flex>
  );
};

export { LoginSignUp };
