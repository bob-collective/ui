import { useLocale } from '@gobob/ui';
import { DlGroup, Dt, Dd } from '@gobob/ui';
import { useTranslation } from 'react-i18next';

import { useGetUser } from '../../../../hooks';

const Spice = () => {
  const { locale } = useLocale();
  const { t } = useTranslation();

  const { data: user } = useGetUser();

  return (
    <DlGroup alignItems='flex-start' direction='column'>
      <Dt size='s' weight='semibold'>
        {t('fusion.userStats.spice')}
      </Dt>
      <Dd weight='bold'>{Intl.NumberFormat(locale).format(user?.leaderboardRank?.total_reward_points ?? 0)}</Dd>
    </DlGroup>
  );
};

export { Spice };
