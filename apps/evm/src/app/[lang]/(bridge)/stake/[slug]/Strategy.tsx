'use client';

import {
  Alert,
  ArrowLeft,
  Avatar,
  Button,
  Card,
  Flex,
  H1,
  H2,
  Link,
  P,
  Skeleton,
  Tabs,
  TabsItem,
  useMediaQuery
} from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useState } from 'react';
import Image from 'next/image';
import { sendGAEvent } from '@next/third-parties/google';
import { useAccount } from 'wagmi';
import { useTheme } from 'styled-components';

import { StrategyDetails, StrategyForm } from '../components';
import { useGetStrategies } from '../hooks';

import { StyledBannerContent } from './Strategy.styles';

import { Layout, Main } from '@/components';
import { RoutesPath } from '@/constants';
import { PageLangParam } from '@/i18n/withLigui';
import { useGetGatewayTransactions } from '@/hooks';
import { posthogEvents } from '@/lib/posthog';
import { gaEvents } from '@/lib/third-parties';

type Props = PageLangParam & {
  params: { slug: string };
};

enum Tab {
  Deposit = 'deposit',
  Withdraw = 'withdraw'
}

function Strategy({ params }: Props) {
  const { refetch: refetchTransactions } = useGetGatewayTransactions();
  const { address } = useAccount();
  const theme = useTheme();
  const isMobileViewport = useMediaQuery(theme.breakpoints.down('md'));

  const [tab, setTab] = useState<Tab>(Tab.Deposit);

  const { data: strategies = [] } = useGetStrategies();

  const strategy = strategies.find((strategy) => strategy.meta.slug === params.slug);

  const isLending = strategy?.meta.type === 'lending';

  const action = isLending ? <Trans>withdraw</Trans> : <Trans>unstake</Trans>;
  const depositTitle = isLending ? <Trans>Supply</Trans> : <Trans>Stake</Trans>;
  const withdrawTitle = isLending ? <Trans>Withdraw</Trans> : <Trans>Unstake</Trans>;
  const bannerAction = isLending ? <Trans>lend</Trans> : <Trans>stake</Trans>;

  const handlePressBOBStake = () => {
    sendGAEvent('event', gaEvents.bobStake, {
      evm_address: address,
      strategy: strategy?.contract.integration.slug,
      amount: strategy?.contract.deposit.amount
    });
    window.open(strategy?.info.links.manage, '_blank', 'noreferrer');
  };

  const handleNavigateWidthdraw = () => {
    posthogEvents.strategies.strategy.externalWithdraw({ asset_name: strategy?.contract.integration.name as string });
  };

  return (
    <Layout>
      <Main maxWidth='5xl' padding='md'>
        <Link href={RoutesPath.STRATEGIES}>
          <Flex alignItems='center' gap='s'>
            <ArrowLeft size='xs' />
            <Trans>Back</Trans>
          </Flex>
        </Link>
        <Flex alignItems='center' gap='lg' marginTop='4xl'>
          {strategy ? (
            <Avatar size='4xl' src={strategy.info.logoUrl || strategy.meta.logo} />
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
        <Flex direction='column' marginTop='lg'>
          <Card
            isPressable
            direction='column'
            justifyContent='center'
            paddingX='xl'
            paddingY='6xl'
            style={{ position: 'relative', maxHeight: '8.5rem' }}
            onPress={handlePressBOBStake}
          >
            <StyledBannerContent direction='column'>
              <Flex alignItems='center'>
                <H2 size='2xl' weight='bold'>
                  {strategy ? (
                    strategy?.contract.deposit.amount.greaterThan(0) ? (
                      <Trans>
                        You have {strategy.contract.deposit.amount.toSignificant(2)}{' '}
                        {strategy.contract.deposit.token.symbol} on BOB
                      </Trans>
                    ) : (
                      <Trans>Already got {strategy?.contract.inputToken.symbol} on BOB?</Trans>
                    )
                  ) : (
                    <Skeleton height='3xl' width='30ch' />
                  )}
                </H2>
              </Flex>
              <P color='grey-50'>
                {strategy ? (
                  <Trans>
                    Go directly to {strategy.meta.name.split(' ').at(0)} to {bannerAction} your{' '}
                    {strategy?.contract.inputToken.symbol}.
                  </Trans>
                ) : (
                  <Skeleton height='xl' width='30ch' />
                )}
              </P>
            </StyledBannerContent>
            {strategy && (
              <Image
                alt={strategy?.info.breakdown.at(-1)?.currency.symbol ?? ''}
                height={25}
                src={strategy?.info.breakdown.at(-1)?.logoUrl ?? ''}
                style={{
                  opacity: isMobileViewport ? 0.2 : 1,
                  position: 'absolute',
                  bottom: 20,
                  right: 170,
                  filter: 'blur(2px)'
                }}
                width={25}
              />
            )}
            {strategy && (
              <Image
                alt={strategy?.info.breakdown.at(0)?.currency.symbol ?? ''}
                height={25}
                src={strategy?.info.breakdown.at(0)?.logoUrl ?? ''}
                style={{
                  opacity: isMobileViewport ? 0.2 : 1,
                  position: 'absolute',
                  top: 30,
                  right: 200,
                  filter: 'blur(2px)'
                }}
                width={25}
              />
            )}
            {strategy && (
              <Image
                alt={strategy?.info.breakdown.at(0)?.currency.symbol ?? ''}
                height={50}
                src={strategy?.info.breakdown.at(0)?.logoUrl ?? ''}
                style={{
                  opacity: isMobileViewport ? 0.2 : 1,
                  position: 'absolute',
                  top: -10,
                  right: 0,
                  filter: 'blur(2px)'
                }}
                width={50}
              />
            )}
            {strategy && (
              <Image
                alt={strategy?.info.breakdown.at(0)?.currency.symbol ?? ''}
                height={90}
                src={strategy?.info.breakdown.at(0)?.logoUrl ?? ''}
                style={{
                  opacity: isMobileViewport ? 0.2 : 1,
                  position: 'absolute',
                  top: '50%',
                  right: 80,
                  transform: 'translateY(-50%)'
                }}
                width={90}
              />
            )}
            {strategy && (
              <Image
                alt={strategy?.info.breakdown.at(-1)?.currency.symbol ?? ''}
                height={90}
                src={strategy?.info.breakdown.at(-1)?.logoUrl ?? ''}
                style={{
                  opacity: isMobileViewport ? 0.2 : 1,
                  position: 'absolute',
                  top: '50%',
                  right: 10,
                  transform: 'translateY(-50%)'
                }}
                width={90}
              />
            )}
          </Card>
        </Flex>
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
                    <Link external href={strategy?.info.links.manage} onPress={handleNavigateWidthdraw}>
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
