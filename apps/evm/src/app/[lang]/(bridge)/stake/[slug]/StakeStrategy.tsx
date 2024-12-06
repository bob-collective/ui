'use client';

import { Dd, Divider, Dl, DlGroup, Dt, Flex, Link } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { truncateUrl } from '@gobob/utils';

import { useGetStakingStrategies } from '../hooks';
import { StakingForm } from '../components';
import { useGetGatewayTransactions } from '../../hooks';
import { stakingInfo as stakingData } from '../../utils/stakeData';

import { Layout } from '@/components';
import { PageLangParam } from '@/i18n/withLigui';
import { chainL2 } from '@/constants';

type Props = PageLangParam & {
  params: { slug: string };
};

function StakeStrategy({ params }: Props) {
  console.log(params);

  const { refetch: refetchTransactions } = useGetGatewayTransactions({});

  const { data: strategies = [] } = useGetStakingStrategies();

  const strategy = strategies.find((strategy) => strategy.raw.integration.slug === params.slug);

  if (!strategy) {
    throw new Error('Missing strategy');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stakingInfo = (stakingData as any)[strategy?.raw.integration.slug];

  return (
    <Layout>
      <Flex direction={{ base: 'column', md: 'row' }} gap='xl' style={{ width: '100%' }}>
        <StakingForm strategy={strategy} onStakeSuccess={refetchTransactions} />
        <Flex direction='column' gap='xl' style={{ width: '100%' }}>
          <Dl direction='column' gap='lg'>
            <DlGroup alignItems='center' justifyContent='space-between'>
              <Dd size='md' style={{ minWidth: '15ch' }}>
                <Trans>Input Token</Trans>
              </Dd>
              <Dt style={{ textAlign: 'right', wordBreak: 'break-word' }}>{stakingInfo?.inputToken}</Dt>
            </DlGroup>
            <Divider />
            <DlGroup alignItems='center' justifyContent='space-between'>
              <Dd size='md' style={{ minWidth: '15ch' }}>
                <Trans>Output Token</Trans>
              </Dd>
              <Dt style={{ textAlign: 'right', wordBreak: 'break-word' }}>
                {strategy?.raw.outputToken ? (
                  <Link
                    external
                    color='grey-50'
                    href={new URL(
                      `/address/${strategy?.raw.outputToken?.address}`,
                      chainL2.blockExplorers?.default.url
                    ).toString()}
                    size='md'
                    underlined='always'
                  >
                    {stakingInfo?.outputToken}
                  </Link>
                ) : (
                  stakingInfo?.outputToken
                )}
              </Dt>
            </DlGroup>
            {stakingInfo?.securityReview && (
              <>
                <Divider />
                <DlGroup alignItems='center' justifyContent='space-between'>
                  <Dd size='md' style={{ minWidth: '15ch' }}>
                    <Trans>Security Review by Bitcoin Layers</Trans>
                  </Dd>
                  <Dt style={{ textAlign: 'right', wordBreak: 'break-word' }}>
                    <Link external color='grey-50' href={stakingInfo?.securityReview} size='md' underlined='always'>
                      {truncateUrl(stakingInfo?.securityReview)}
                    </Link>
                  </Dt>
                </DlGroup>
              </>
            )}
            <Divider />
            <DlGroup alignItems='center' justifyContent='space-between'>
              <Dd size='md' style={{ minWidth: '15ch' }}>
                <Trans>Website</Trans>
              </Dd>
              <Dt style={{ textAlign: 'right', wordBreak: 'break-word' }}>
                <Link external color='grey-50' href={stakingInfo?.website} size='md' underlined='always'>
                  {truncateUrl(stakingInfo?.website)}
                </Link>
              </Dt>
            </DlGroup>
          </Dl>
        </Flex>
      </Flex>
    </Layout>
  );
}

export { StakeStrategy };
