import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Flex, H1, H2 } from '@gobob/ui';
import QRCode from 'react-qr-code';
import { useAccount } from 'wagmi';
import { truncateEthAddress } from '@gobob/utils';

import { Main } from '../../components';
import { RoutesPath } from '../../constants';

const Receive = () => {
  const { user } = useDynamicContext();
  const { address } = useAccount();

  return (
    <Main maxWidth='s' padding='md'>
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
            {user?.email ? user?.email : truncateEthAddress(address!)}
          </H1>
          {user?.email && (
            <H2 align='center' color='grey-100' size='xl' weight='bold'>
              ({truncateEthAddress(address!)})
            </H2>
          )}
        </Flex>
        <QRCode
          bgColor='transparent'
          fgColor='#ffffff'
          size={256}
          style={{ height: 'auto', maxWidth: '100%', width: '100%', background: 'transparent' }}
          value={`${window.location.host}${RoutesPath.SEND}?to=${user?.email || address}`}
          viewBox={`0 0 256 256`}
        />
      </Flex>
    </Main>
  );
};

export { Receive };
