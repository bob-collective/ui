import { useMemo } from 'react';
import { Alert, P, Link } from '@gobob/ui';
import { Trans } from '@lingui/macro';

import { BridgeToken } from '@/hooks';

type BridgeAlertProps = {
  token: BridgeToken;
};

const BridgeAlert = ({ token }: BridgeAlertProps): JSX.Element | null => {
  const assetMessage: Record<string, JSX.Element> = useMemo(
    () => ({
      alexgo: (
        <Trans>
          Bridging ALEX is disabled because Alex Lab suffered an exploit involving the XLink bridge. For more
          information, kindly refer to this{' '}
          <Link external href='https://x.com/ALEXLabBTC/status/1790815791832498291' size='s'>
            announcement
          </Link>
          .
        </Trans>
      )
    }),
    []
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
