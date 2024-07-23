import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Button, Flex, H1, H2 } from '@gobob/ui';
import QRCode from 'react-qr-code';
import { truncateEthAddress } from '@gobob/utils';
import { useCopyToClipboard } from 'react-use';

import { Main } from '../../components';
import { RoutesPath } from '../../constants';
import { useDynamicAddress } from '../../hooks';

const Receive = () => {
  const { user } = useDynamicContext();
  const address = useDynamicAddress();
  const [, copy] = useCopyToClipboard();

  if (!user || !address) {
    return null;
  }

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
            {user?.email ? user?.email : truncateEthAddress(address)}
          </H1>
          {user?.email && (
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
          value={`https://${window.location.host}${RoutesPath.SEND}?to=${encodeURIComponent(user?.email || address || '')}`}
          viewBox={`0 0 256 256`}
        />
        <Button color='primary' size='lg' onPress={() => copy(address)}>
          Copy Address
        </Button>
      </Flex>
    </Main>
  );
};

export { Receive };
