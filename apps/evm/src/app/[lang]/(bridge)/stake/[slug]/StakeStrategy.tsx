'use client';

import { PellNetwork } from '@gobob/icons';
import { Alert, ArrowLeft, Avatar, Card, Flex, H1, H2, Link, P, Span, Tabs, TabsItem } from '@gobob/ui';
import { Trans } from '@lingui/macro';

import { useGetGatewayTransactions } from '../../hooks';
import { stakingInfo as stakingData } from '../../utils/stakeData';
import { StakingForm } from '../components';
import { StakeDetails } from '../components/StakeDetails';
import { useGetStakingStrategies } from '../hooks';

import { Layout, Main } from '@/components';
import { RoutesPath } from '@/constants';
import { PageLangParam } from '@/i18n/withLigui';

type Props = PageLangParam & {
  params: { slug: string };
};

function StakeStrategy({ params }: Props) {
  const { refetch: refetchTransactions } = useGetGatewayTransactions({});

  const { data: strategies = [] } = useGetStakingStrategies();

  const strategy = strategies.find((strategy) => strategy.raw.integration.slug === params.slug);

  if (!strategy) {
    return null;
  }

  const stakingInfo = stakingData[strategy?.raw.integration.slug];

  if (!stakingInfo) return null;

  const isLending = strategy.raw.integration.type === 'lending';

  return (
    <Layout>
      <Main maxWidth='5xl' padding='lg'>
        <Link href={RoutesPath.STAKE}>
          <Flex alignItems='center' gap='s'>
            <ArrowLeft size='xs' /> Back
          </Flex>
        </Link>
        <Flex alignItems='center' gap='lg' marginTop='4xl'>
          {strategy.raw.integration.logo ? (
            <Avatar size={'4xl'} src={strategy.raw.integration.logo} />
          ) : (
            <PellNetwork style={{ height: '1.3rem', width: '1.3rem' }} />
          )}
          <Flex alignItems='flex-start' direction='column'>
            <H1 size='lg'>{stakingInfo.strategy}</H1>
            <H2 color='grey-50' size='md' weight='medium'>
              {stakingInfo.protocol}
            </H2>
          </Flex>
        </Flex>
        {stakingInfo?.warningMessage && (
          <Alert status='warning' style={{ marginTop: '1rem' }} variant='outlined'>
            {stakingInfo.warningMessage}
          </Alert>
        )}
        <Flex direction={{ base: 'column', md: 'row' }} gap='xl' marginTop='3xl' style={{ width: '100%' }}>
          <Card flex={1}>
            <Tabs fullWidth size='lg'>
              <TabsItem key='deposit' title={isLending ? <Trans>Supply</Trans> : <Trans>Stake</Trans>}>
                <StakingForm stakingInfo={stakingInfo} strategy={strategy} onStakeSuccess={refetchTransactions} />
              </TabsItem>
              <TabsItem key='withdraw' title={isLending ? <Trans>Withdraw</Trans> : <Trans>Unstake</Trans>}>
                <P>Follow these step to unstake your asset:</P>
                <Flex
                  aria-label='how to unstake'
                  direction='column'
                  elementType='ol'
                  gap='s'
                  marginLeft='3xl'
                  style={{ listStyleType: 'decimal' }}
                >
                  <li>
                    <Span>
                      Go to <Link>{stakingInfo.protocol} website</Link>
                    </Span>
                  </li>
                  <li>
                    <Span>Connect your wallet</Span>
                  </li>
                  <li>
                    <Span>
                      Navigate to the <Link>Account Page</Link>
                    </Span>
                  </li>
                  <li>
                    <Span>Click in the tBTC item under Supplied assets</Span>
                  </li>
                  <li>
                    <Span>Click on the Withdraw tab</Span>
                  </li>
                </Flex>
              </TabsItem>
            </Tabs>
          </Card>
          <StakeDetails strategy={strategy} />
        </Flex>
      </Main>
    </Layout>
  );
}

export { StakeStrategy };
