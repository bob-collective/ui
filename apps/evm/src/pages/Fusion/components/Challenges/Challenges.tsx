import { H2, P, Flex, TextLink } from '@gobob/ui';
import { Trans, useTranslation } from 'react-i18next';

const Challenges = () => {
  const { t } = useTranslation();

  return (
    <Flex direction='column' gap='xl'>
      <H2 size='2xl' weight='semibold'>
        {t('fusion.challenges.title')}
      </H2>
      <P color='grey-200'>
        <Trans
          components={{
            galxeLink: <TextLink external href=' https://app.galxe.com/quest/BOB' size='s' />
          }}
          i18nKey='fusion.challenges.content'
        />
      </P>
    </Flex>
  );
};

export { Challenges };
