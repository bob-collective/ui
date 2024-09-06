import { DateTime } from 'luxon';
import { P, Span } from '@gobob/ui';
import { useEffect, useState } from 'react';

import { StyledCard } from './Countdown.style';

const CAMPAIGN_END_DATE = DateTime.local(2024, 9, 18);

const Countdown = () => {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    setInterval(() => {
      const now = DateTime.now();
      const remaining = CAMPAIGN_END_DATE.diff(now).toFormat(`d'd' h'h' m'm' ss`);

      setCountdown(remaining);
    }, 1000);
  }, []);

  return (
    <StyledCard>
      <P color='grey-50' size='s' style={{ width: '180dppx' }}>
        Season 3 starts in:{' '}
        <Span color='primary-500' size='s' weight='semibold'>
          {countdown}
        </Span>
      </P>
    </StyledCard>
  );
};

export { Countdown };
