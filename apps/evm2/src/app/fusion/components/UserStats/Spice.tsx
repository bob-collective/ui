import { useLocale } from '@gobob/ui';
import { DlGroup, Dt, Dd } from '@gobob/ui';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';
import { CountUp } from 'countup.js';

import { useGetUser } from '@/hooks';

const Spice = () => {
  const { locale } = useLocale();
  const t = useTranslations();

  const spiceCountRef = useRef(null);

  const { data: user } = useGetUser();

  const totalRewardPoints = useMemo(
    () => user?.leaderboardRank?.total_reward_points || 0,

    [user]
  );

  useEffect(() => {
    const spiceAnimation = new CountUp(spiceCountRef.current as any, totalRewardPoints, {
      decimalPlaces: 2
    });

    spiceAnimation.start();
  }, [totalRewardPoints]);

  return (
    <DlGroup alignItems='flex-start' direction='column'>
      <Dt size='s' weight='semibold'>
        {t('fusion.userStats.spice')}
      </Dt>
      <Dd ref={spiceCountRef} weight='bold'>
        {Intl.NumberFormat(locale).format(totalRewardPoints)}
      </Dd>
    </DlGroup>
  );
};

export { Spice };
