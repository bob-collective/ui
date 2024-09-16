import { Alert, P, Link } from '@gobob/ui';
import { Trans } from 'react-i18next';

import { BridgeToken } from '../../../../hooks';

type BridgeAlertProps = {
  token: BridgeToken;
};

const assetMessage: Record<string, JSX.Element> = {
  alexgo: (
    <Trans
      components={{
        xLink: (
          <Link external href='https://x.com/ALEXLabBTC/status/1790815791832498291' size='s'>
            announcement
          </Link>
        )
      }}
      i18nKey='bridge.alert.alex'
    />
  )
};

const BridgeAlert = ({ token }: BridgeAlertProps): JSX.Element | null => {
  const message = assetMessage[token.l1Token.apiId];

  if (!message) return null;

  return (
    <Alert status='warning' variant='outlined'>
      <P size='s'>{message}</P>
    </Alert>
  );
};

export { BridgeAlert };
