'use client';

import { Alert, ArrowLeft, Avatar, Button, Card, Flex, H1, H2, Link, P, Skeleton, Tabs, TabsItem } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useState } from 'react';

import { useGetGatewayTransactions } from '../../hooks';
import { StrategyDetails, StrategyForm } from '../components';
import { useGetStrategies } from '../hooks';

import { Layout, Main } from '@/components';
import { RoutesPath } from '@/constants';
import { PageLangParam } from '@/i18n/withLigui';

type Props = PageLangParam & {
  params: { slug: string };
};

enum Tab {
  Deposit = 'deposit',
  Withdraw = 'withdraw'
}

function Strategy({ params }: Props) {
  const { refetch: refetchTransactions } = useGetGatewayTransactions({});
  const [tab, setTab] = useState<Tab>(Tab.Deposit);

  const { data: strategies = [] } = useGetStrategies();

  const strategy = strategies.find((strategy) => strategy.meta.slug === params.slug);

  const isLending = strategy?.meta.type === 'lending';

  const action = isLending ? <Trans>withdraw</Trans> : <Trans>unstake</Trans>;
  const depositTitle = isLending ? <Trans>Supply</Trans> : <Trans>Stake</Trans>;
  const withdrawTitle = isLending ? <Trans>Withdraw</Trans> : <Trans>Unstake</Trans>;

  return (
    <Layout>
      <Main maxWidth='5xl' padding='lg'>
        <Link href={RoutesPath.STRATEGIES}>
          <Flex alignItems='center' gap='s'>
            <ArrowLeft size='xs' />
            <Trans>Back</Trans>
          </Flex>
        </Link>
        <Flex alignItems='center' gap='lg' marginTop='4xl'>
          {strategy ? (
            <Avatar size='4xl' src={strategy.meta.logo || strategy.info.logoUrl} />
          ) : (
            <Skeleton height='4xl' rounded='full' width='4xl' />
          )}

          <Flex alignItems='flex-start' direction='column'>
            <H1 size='lg'>{strategy ? strategy.info.name : <Skeleton height='xl' width='12rem' />}</H1>
            <H2 color='grey-50' size='md' weight='medium'>
              {strategy ? strategy.info.protocol : <Skeleton height='xl' width='8rem' />}
            </H2>
          </Flex>
        </Flex>
        {strategy?.info?.warningMessage && (
          <Alert status='warning' style={{ marginTop: '1rem' }} variant='outlined'>
            {strategy?.info.warningMessage}
          </Alert>
        )}
        <Flex direction={{ base: 'column', md: 'row' }} gap='xl' marginTop='3xl' style={{ width: '100%' }}>
          <Card flex='1 0 0%' style={{ height: 'max-content' }}>
            <Tabs fullWidth selectedKey={tab} size='lg' onSelectionChange={(key) => setTab(key as Tab)}>
              <TabsItem key={Tab.Deposit} title={strategy ? depositTitle : <Skeleton height='xl' width='6rem' />}>
                <StrategyForm isLending={isLending} strategy={strategy} onSuccess={refetchTransactions} />
              </TabsItem>
              <TabsItem key={Tab.Withdraw} title={strategy ? withdrawTitle : <Skeleton height='xl' width='6rem' />}>
                <Flex
                  alignItems='center'
                  direction='column'
                  flex={1}
                  gap='xl'
                  justifyContent='center'
                  marginTop='md'
                  paddingX='md'
                  style={{ height: '100%', minHeight: '25rem' }}
                >
                  <P align='center' color='grey-50' size='s'>
                    <Trans>
                      Complete your {action} by accessing {strategy?.info.protocol} Dapp using the button bellow
                    </Trans>
                  </P>
                  <Button asChild color='primary'>
                    <Link external href={strategy?.info.links.manage}>
                      Go to {strategy?.info.protocol} Dapp
                    </Link>
                  </Button>
                </Flex>
              </TabsItem>
            </Tabs>
          </Card>
          <StrategyDetails isLending={isLending} strategy={strategy} />
        </Flex>
      </Main>
    </Layout>
  );
}

export { Strategy };
