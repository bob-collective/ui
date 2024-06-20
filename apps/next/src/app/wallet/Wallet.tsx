'use client';

import { Button, Card, Dd, Dl, DlGroup, Dt, Flex, H1, P } from '@gobob/ui';
import { useAccount } from '@gobob/wagmi';
import { AuthButton, useConnectModal } from '@gobob/connect-ui';

import { Main } from '../../components';
import { useTotalBalance } from '../../hooks';
import { L2_CHAIN, isL2Chain } from '../../constants';

import { TokenTable } from './components';

const Wallet = () => {
  const { address, chain } = useAccount();
  const { open } = useConnectModal();
  const { formatted } = useTotalBalance(L2_CHAIN);

  const isOnL2Chain = chain && isL2Chain(chain);

  return (
    <Main maxWidth='5xl' padding='2xl'>
      <Flex direction='column'>
        <H1 size='2xl' weight='semibold'>
          BOB Wallet
        </H1>
        <P color='grey-200'>View a summary of your wallet on the BOB network.</P>
      </Flex>
      {address ? (
        isOnL2Chain ? (
          <>
            <Card marginTop='2xl' padding='2xl'>
              <Dl>
                <DlGroup alignItems='flex-start' direction='column' gap='xs'>
                  <Dt size='xs'>Total Assets</Dt>
                  <Dd size='md' weight='semibold'>
                    {formatted}
                  </Dd>
                </DlGroup>
              </Dl>
            </Card>
            <TokenTable />
          </>
        ) : (
          <Card
            alignItems='center'
            gap='2xl'
            justifyContent='center'
            marginTop='2xl'
            style={{ maxHeight: 'calc(100vh - 12rem)', minHeight: '20rem', height: '18rem' }}
          >
            <AuthButton chain={L2_CHAIN} color='primary' />
          </Card>
        )
      ) : (
        <Card
          alignItems='center'
          gap='2xl'
          justifyContent='center'
          marginTop='2xl'
          style={{ maxHeight: 'calc(100vh - 12rem)', minHeight: '20rem', height: '18rem' }}
        >
          <Flex direction='column' gap='s'>
            <P align='center'>No assets shown</P>
            <P align='center' color='grey-200'>
              Please connect a wallet
            </P>
          </Flex>
          <Button color='primary' onPress={() => open()}>
            Connect Wallet
          </Button>
        </Card>
      )}
    </Main>
  );
};

export { Wallet };
