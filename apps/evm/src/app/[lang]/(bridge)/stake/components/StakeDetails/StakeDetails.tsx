'use client';

import { Avatar, Card, Dd, Divider, Dl, DlGroup, Dt, Flex, Link, Span, useCurrencyFormatter } from '@gobob/ui';
import { truncateEthAddress } from '@gobob/utils';
import { Trans } from '@lingui/macro';

import { stakingInfo as stakingData } from '../../../utils/stakeData';
import { StrategyData } from '../../hooks';
import { StakeRewards } from '../StakeRewards';

import { StyledArrowLongRight } from './StakeDetails.style';

import { chainL2, L2_CHAIN } from '@/constants';
import { ChainAsset } from '@/components';

type StakeDetailsProps = {
  strategy: StrategyData;
};

const StakeDetails = ({ strategy }: StakeDetailsProps) => {
  const format = useCurrencyFormatter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stakingInfo = (stakingData as any)[strategy?.raw.integration.slug];

  return (
    <Dl direction='column' flex={1} gap='xl'>
      <Flex direction={{ base: 'column', s: 'row' }} gap='xl' style={{ width: '100%' }}>
        <Card flex={0.7}>
          <DlGroup alignItems='flex-start' direction='column'>
            <Dd color='grey-50' size='s'>
              <Trans>Rewards</Trans>
            </Dd>
            <StakeRewards wrap elementType='dt' slug={strategy?.raw.integration.slug ?? ''} />
          </DlGroup>
        </Card>
        <Card flex={0.3}>
          <DlGroup alignItems='flex-start' direction='column'>
            <Dd color='grey-50' size='s'>
              <Trans>TVL</Trans>
            </Dd>
            <Dt color='light' size='lg' weight='semibold'>
              {strategy?.tvl ? format(strategy.tvl) : '-'}
            </Dt>
          </DlGroup>
        </Card>
      </Flex>
      <Card direction='column' gap='xl' style={{ width: '100%' }}>
        <DlGroup alignItems='flex-start' direction='column'>
          <Dt color='grey-50' size='s'>
            <Trans>Description</Trans>
          </Dt>
          <Dd size='s'>{stakingInfo.about}</Dd>
        </DlGroup>
        <Divider />
        <Flex gap='md'>
          <DlGroup alignItems='flex-start' direction='column' gap='xl' style={{ width: '100%' }}>
            <Dd color='grey-50' size='s'>
              <Trans>Strategy Breakdown</Trans>
            </Dd>
            <Flex
              alignItems='center'
              direction={{ base: 'column', s: 'row' }}
              gap='2xl'
              justifyContent='center'
              style={{ width: '100%' }}
            >
              <Flex alignItems='center' elementType='dt' gap='md'>
                <Avatar alt={stakingInfo?.inputToken} size='5xl' src={stakingInfo?.inputTokenLogoUrl} />
                <Flex direction='column'>
                  <Span color='grey-50' size='xs'>
                    Input
                  </Span>
                  <Span lineHeight='1.2'>{stakingInfo?.inputToken}</Span>
                  <Span color='grey-50' size='s'>
                    Bitcoin
                  </Span>
                </Flex>
              </Flex>
              <StyledArrowLongRight />
              <Flex alignItems='center' elementType='dt' gap='md'>
                <ChainAsset
                  asset={<Avatar alt={stakingInfo?.outputToken} size='5xl' src={strategy.raw.integration.logo} />}
                  chainId={L2_CHAIN}
                  chainProps={{ size: 'xs' }}
                />

                <Flex direction='column'>
                  <Span color='grey-50' size='xs'>
                    Output
                  </Span>
                  <Span lineHeight='1.2'>{stakingInfo?.outputToken}</Span>
                  <Link
                    external
                    icon
                    color='grey-50'
                    href={new URL(
                      `/address/${strategy?.raw.outputToken?.address}`,
                      chainL2.blockExplorers?.default.url
                    ).toString()}
                    size='s'
                  >
                    {truncateEthAddress(strategy?.raw.outputToken?.address || '')}
                  </Link>
                </Flex>
              </Flex>
            </Flex>
          </DlGroup>
        </Flex>
        <Divider />
        <DlGroup alignItems='flex-start' direction='column' gap='lg'>
          <Dt color='grey-50' size='s'>
            <Trans>Additional Information</Trans>
          </Dt>
          <Flex wrap elementType='dd' gap={{ base: 'md', s: 'xl' }}>
            <Link external icon href={stakingInfo?.website}>
              <Trans>Website</Trans>
            </Link>
            {stakingInfo?.securityReview && (
              <>
                <Link external icon href={stakingInfo?.securityReview}>
                  <Trans>Security Review by Bitcoin Layers</Trans>
                </Link>
              </>
            )}
          </Flex>
        </DlGroup>
      </Card>
    </Dl>
  );
};

export { StakeDetails };
