'use client';

import { PellNetwork } from '@gobob/icons';
import { ArrowLeft, Avatar, Flex, H1, H2, Link, P } from '@gobob/ui';

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stakingInfo = (stakingData as any)[strategy?.raw.integration.slug];

  return (
    <Layout>
      <Main maxWidth='5xl' padding='lg'>
        <Link href={RoutesPath.STAKE}>
          <Flex alignItems='center' gap='s'>
            <ArrowLeft size='xs' /> Back
          </Flex>
        </Link>
        <Flex direction='column' gap='lg' marginTop='4xl'>
          <Flex alignItems='center' gap='lg'>
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
          <P>{stakingInfo?.about}</P>
        </Flex>
        <Flex direction={{ base: 'column', md: 'row' }} gap='xl' marginTop='3xl' style={{ width: '100%' }}>
          <StakingForm strategy={strategy} onStakeSuccess={refetchTransactions} />
          <StakeDetails strategy={strategy} />
        </Flex>
      </Main>
    </Layout>
  );
}

export { StakeStrategy };
