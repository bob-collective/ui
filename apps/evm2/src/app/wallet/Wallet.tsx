'use client';

import { Button, Card, Dd, Dl, DlGroup, Dt, Flex, H1, P } from '@gobob/ui';
import { useAccount } from '@gobob/wagmi';
import { useTranslation } from 'next-i18next';
import { AuthButton, useConnectModal } from '@gobob/connect-ui';

import { TokenTable } from './components';

import { Main } from '@/components';
import { useTotalBalance } from '@/hooks';
import { L2_CHAIN, isL2Chain } from '@/constants';

const Wallet = () => {
  const { address, chain } = useAccount();
  const { open } = useConnectModal();
  const { formatted } = useTotalBalance(L2_CHAIN);

  const { t } = useTranslation();

  const isOnL2Chain = chain && isL2Chain(chain);

  return (
    <Main maxWidth='5xl' padding='2xl'>
      <Flex direction='column'>
        <H1 size='2xl' weight='semibold'>
          {t('wallet.title')}
        </H1>
        <P color='grey-50'> {t('wallet.summary')}</P>
      </Flex>
      {address ? (
        isOnL2Chain ? (
          <>
            <Card marginTop='2xl' padding='2xl'>
              <Dl>
                <DlGroup alignItems='flex-start' direction='column' gap='xs'>
                  <Dt size='xs'>{t('wallet.assets.title')}</Dt>
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
            <P align='center'>{t('wallet.assets.noAssets')}</P>
            <P align='center' color='grey-50'>
              {t('wallet.assets.connect')}
            </P>
          </Flex>
          <Button color='primary' onPress={() => open()}>
            {t('wallet.assets.connectLabel')}
          </Button>
        </Card>
      )}
    </Main>
  );
};

export { Wallet };
