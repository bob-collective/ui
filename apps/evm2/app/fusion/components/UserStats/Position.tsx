import { DlGroup, Dt, Dd } from '@gobob/ui';
import { useTranslation } from 'next-i18next';

import { useGetUser } from '@/hooks';

const Position = () => {
  const { t } = useTranslation();

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
