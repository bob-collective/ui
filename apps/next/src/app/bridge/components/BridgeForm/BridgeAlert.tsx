import { Alert, P, TextLink } from '@gobob/ui';

import { BridgeToken } from '../../hooks';

type BridgeAlertProps = {
  token: BridgeToken;
};

const assetMessage: Record<string, JSX.Element> = {
  alexgo: (
    <>
      Bridging ALEX is disabled because Alex Lab suffered an exploit involving the XLink bridge. For more information,
      kindly refer to this
      {
        <TextLink external href='https://x.com/ALEXLabBTC/status/1790815791832498291' size='s'>
          announcement
        </TextLink>
      }
      .
    </>
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
