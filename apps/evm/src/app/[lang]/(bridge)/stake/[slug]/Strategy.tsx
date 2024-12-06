'use client';

import { Alert, ArrowLeft, Avatar, Button, Card, Flex, H1, H2, Link, P, Tabs, TabsItem } from '@gobob/ui';
import { Trans } from '@lingui/macro';

import { useGetGatewayTransactions } from '../../hooks';
import { StrategyDetails, StrategyForm } from '../components';
import { useGetStrategies } from '../hooks';

import { Layout, Main } from '@/components';
import { RoutesPath } from '@/constants';
import { PageLangParam } from '@/i18n/withLigui';

type Props = PageLangParam & {
  params: { slug: string };
};

function Strategy({ params }: Props) {
  const { refetch: refetchTransactions } = useGetGatewayTransactions({});

  const { data: strategies = [] } = useGetStrategies();

  const strategy = strategies.find((strategy) => strategy.meta.slug === params.slug);

  if (!strategy) {
    return null;
  }

  const isLending = strategy.meta.type === 'lending';

  return (
    <Layout>
      <Main maxWidth='5xl' padding='lg'>
        <Link href={RoutesPath.STRATEGIES}>
          <Flex alignItems='center' gap='s'>
            <ArrowLeft size='xs' /> Back
          </Flex>
        </Link>
        <Flex alignItems='center' gap='lg' marginTop='4xl'>
          <Avatar
            size='4xl'
            src={
              strategy.meta.logo ||
              'https://github.com/0xPellNetwork/pell_media_kit/blob/main/logos/500r_whiteblack.png?raw=true'
            }
          />

          <Flex alignItems='flex-start' direction='column'>
            <H1 size='lg'>{strategy.info.name}</H1>
            <H2 color='grey-50' size='md' weight='medium'>
              {strategy.info.protocol}
            </H2>
          </Flex>
        </Flex>
        {strategy.info?.warningMessage && (
          <Alert status='warning' style={{ marginTop: '1rem' }} variant='outlined'>
            {strategy.info.warningMessage}
          </Alert>
        )}
        <Flex direction={{ base: 'column', md: 'row' }} gap='xl' marginTop='3xl' style={{ width: '100%' }}>
          <Card flex='1 0 0%'>
            <Tabs fullHeight fullWidth size='lg'>
              <TabsItem key='deposit' title={isLending ? <Trans>Supply</Trans> : <Trans>Stake</Trans>}>
                <StrategyForm isLending={isLending} strategy={strategy} onSuccess={refetchTransactions} />
              </TabsItem>
              <TabsItem key='withdraw' title={isLending ? <Trans>Withdraw</Trans> : <Trans>Unstake</Trans>}>
                <Flex
                  alignItems='center'
                  direction='column'
                  flex={1}
                  gap='xl'
                  justifyContent='center'
                  marginTop='md'
                  paddingX='md'
                  style={{ height: '100%' }}
                >
                  <P align='center' color='grey-50' size='s'>
                    Complete your {isLending ? <Trans>withdraw</Trans> : <Trans>unstake</Trans>} by accessing{' '}
                    {strategy.info.protocol} Dapp using the button bellow
                  </P>
                  <Button asChild color='primary'>
                    <Link external href={strategy.info.links.manage}>
                      Go to {strategy.info.protocol} Dapp
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
