import { useLocale } from '@gobob/ui';
import { DlGroup, Dt, Dd } from '@gobob/ui';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { CountUp } from 'countup.js';

import { useGetUser } from '../../../../hooks';

const Spice = () => {
  const { locale } = useLocale();
  const { t } = useTranslation();

  let spiceCountRef = useRef(null);

  const { data: user } = useGetUser();

  useEffect(() => {
    const spiceAnimation = new CountUp(spiceCountRef.current as any, user?.leaderboardRank?.total_reward_points || 0);

    spiceAnimation.start();
  }, [user]);

  return (
    <DlGroup alignItems='flex-start' direction='column'>
      <Dt size='s' weight='semibold'>
        {t('fusion.userStats.spice')}
      </Dt>
      <Dd ref={spiceCountRef} weight='bold'>
        {Intl.NumberFormat(locale).format(user?.leaderboardRank?.total_reward_points ?? 0)}
      </Dd>
    </DlGroup>
  );
};

export { Spice };
