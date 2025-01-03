'use client';

import { useDynamicContext, UserProfile } from '@dynamic-labs/sdk-react-core';
import { Button, Flex, H1, H2 } from '@gobob/ui';
import { truncateEthAddress } from '@gobob/utils';
import QRCode from 'react-qr-code';
import { useCopyToClipboard } from 'usehooks-ts';
import { Trans } from '@lingui/macro';

import { Main } from '@/components';
import { RoutesPath } from '@/constants';
import { useDynamicAddress } from '@/hooks';
import { withAuth } from '@/utils/with-auth';

const extractHandle = (user: UserProfile | undefined) => {
  if (user?.email) {
    return user?.email;
  }

  // look for tg handle
  const credentials = user?.verifiedCredentials.find((x) => x.oauthProvider == 'telegram');

  if (credentials) {
    return `@${credentials.oauthUsername}`;
  }

  return undefined;
};

const Receive = () => {
  const { user } = useDynamicContext();
  const address = useDynamicAddress();
  const [, copy] = useCopyToClipboard();

  if (!user || !address) {
    return null;
  }

  const handle = extractHandle(user);

  return (
    <Main maxWidth='md' padding='md'>
      <Flex
        alignItems='center'
        direction='column'
        gap='2xl'
        justifyContent='center'
        padding='4xl'
        style={{ minHeight: 'inherit' }}
      >
        <Flex direction='column'>
          <H1 align='center' size='2xl' weight='bold'>
            {handle || truncateEthAddress(address)}
          </H1>
          {handle && (
            <H2 align='center' color='grey-100' size='xl' weight='bold'>
              ({truncateEthAddress(address)})
            </H2>
          )}
        </Flex>
        <QRCode
          bgColor='transparent'
          fgColor='#ffffff'
          size={256}
          style={{ height: 'auto', maxWidth: '100%', width: '100%', background: 'transparent' }}
          value={`https://${window.location.host}${RoutesPath.SEND}?to=${encodeURIComponent(handle || address || '')}`}
          viewBox={`0 0 256 256`}
        />
        <Button color='primary' size='lg' onPress={() => copy(address)}>
          <Trans>Copy Address</Trans>
        </Button>
      </Flex>
    </Main>
  );
};

export default withAuth(Receive);
