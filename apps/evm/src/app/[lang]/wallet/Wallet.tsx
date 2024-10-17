'use client';

import { Button, Card, Dd, Dl, DlGroup, Dt, Flex, H1, P } from '@gobob/ui';
import { useAccount } from '@gobob/wagmi';
import { Trans } from '@lingui/macro';

import { TokenTable } from './components';

import { AuthButton, useConnectModal } from '@/connect-ui';
import { Main } from '@/components';
import { L2_CHAIN, isL2Chain } from '@/constants';
import { useTotalBalance } from '@/hooks';

const Wallet = () => {
  const { address, chain } = useAccount();
  const { open } = useConnectModal();
  const { formatted } = useTotalBalance(L2_CHAIN);

  const isOnL2Chain = chain && isL2Chain(chain);

  return (
    <Main maxWidth='5xl' padding='2xl'>
      <Flex direction='column'>
        <H1 size='2xl' weight='semibold'>
          <Trans>BOB Wallet</Trans>
        </H1>
        <P color='grey-50'>
          {' '}
          <Trans>View a summary of your wallet on the BOB network. DeFi positions may not be tracked.</Trans>
        </P>
      </Flex>
      {address ? (
        isOnL2Chain ? (
          <>
            <Card marginTop='2xl' padding='2xl'>
              <Dl>
                <DlGroup alignItems='flex-start' direction='column' gap='xs'>
                  <Dt size='xs'>
                    <Trans>Total Assets</Trans>
                  </Dt>
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
            <P align='center'>
              <Trans>No assets shown</Trans>
            </P>
            <P align='center' color='grey-50'>
              <Trans>Please connect a wallet</Trans>
            </P>
          </Flex>
          <Button color='primary' onPress={() => open()}>
            <Trans>Connect Wallet</Trans>
          </Button>
        </Card>
      )}
    </Main>
  );
};

export { Wallet };
