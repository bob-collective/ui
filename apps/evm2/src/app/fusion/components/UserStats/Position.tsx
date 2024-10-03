import { DlGroup, Dt, Dd } from '@gobob/ui';
import { useTranslations } from 'next-intl';

import { useGetUser } from '@/hooks';

const Position = () => {
  const t = useTranslations();

  const { data: user } = useGetUser();

  return (
    <DlGroup alignItems='flex-start' direction='column'>
      <Dt size='s' weight='semibold'>
        {t('fusion.userStats.position')}
      </Dt>
      <Dd weight='bold'>{user?.leaderboardRank?.rank ?? 'N/A'}</Dd>
    </DlGroup>
  );
};

export { Position };
