import { CardProps, Flex, H3 } from '@gobob/ui';
import { useTranslation } from 'react-i18next';

import { ResultVotingAppInfo } from '../../hooks';

import { PodiumCategory } from './PodiumCategory';

type Props = {
  results?: ResultVotingAppInfo;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type AppPodiumProps = Props & InheritAttrs;

const AppsPodium = ({ results }: AppPodiumProps): JSX.Element => {
  const { t } = useTranslation();

  const [categoryOne, categoryTwo, categoryThree] = results?.categories || [undefined, undefined, undefined];

  return (
    <Flex direction='column' gap='3xl' marginTop='4xl'>
      <H3 size='3xl'>{t('apps.podium.winners')}</H3>
      <Flex wrap direction={{ base: 'column', md: 'row' }} gap='md' style={{ position: 'relative' }}>
        <PodiumCategory category={categoryOne} color='red' />
        <PodiumCategory category={categoryTwo} color='purple' />
        <PodiumCategory category={categoryThree} color='pink' />
      </Flex>
    </Flex>
  );
};

export { AppsPodium };
