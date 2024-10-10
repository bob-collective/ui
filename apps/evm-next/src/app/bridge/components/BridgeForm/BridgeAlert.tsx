import { useMemo } from 'react';
import { Alert, P, Link } from '@gobob/ui';
import { useTranslations } from 'next-intl';

import { BridgeToken } from '@/hooks';

type BridgeAlertProps = {
  token: BridgeToken;
};

const BridgeAlert = ({ token }: BridgeAlertProps): JSX.Element | null => {
  const t = useTranslations();

  const assetMessage: Record<string, ReturnType<typeof t.rich>> = useMemo(
    () => ({
      alexgo: t.rich('bridge.alert.alex', {
        xLink: (chunk) => (
          <Link external href='https://x.com/ALEXLabBTC/status/1790815791832498291' size='s'>
            {chunk}
          </Link>
        )
      })
    }),
    [t]
  );

  const message = assetMessage[token.l1Token.apiId];

  if (!message) return null;

  return (
    <Alert status='warning' variant='outlined'>
      <P size='s'>{message}</P>
    </Alert>
  );
};

export { BridgeAlert };
