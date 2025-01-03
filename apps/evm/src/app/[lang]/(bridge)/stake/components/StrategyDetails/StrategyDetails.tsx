'use client';

import { Avatar, Card, Dd, Divider, Dl, DlGroup, Dt, Flex, Link, Span, useCurrencyFormatter } from '@gobob/ui';
import { truncateEthAddress } from '@gobob/utils';
import { Trans } from '@lingui/macro';

import { StrategyData } from '../../hooks';
import { StrategyRewards } from '../StrategyRewards';

import { StyledArrowLongRight } from './StrategyDetails.style';

import { chainL2, L2_CHAIN } from '@/constants';
import { AmountLabel, ChainAsset } from '@/components';

type StrategyDetailsProps = {
  strategy: StrategyData;
  isLending?: boolean;
};

const StrategyDetails = ({ strategy, isLending }: StrategyDetailsProps) => {
  const format = useCurrencyFormatter();

  return (
    <Dl direction='column' flex={1} gap='xl'>
      {strategy.userDepositAmount && (
        <Card alignItems='flex-start' direction='column'>
          <Dt color='grey-50' size='s'>
            {isLending ? <Trans>Lent Amount</Trans> : <Trans>Staked Amount</Trans>}
          </Dt>
          <Dd color='light' size='lg' weight='semibold'>
            <AmountLabel hidePrice amount={strategy.userDepositAmount} />
          </Dd>
        </Card>
      )}
      <Flex direction={{ base: 'column', s: 'row' }} gap='xl' style={{ width: '100%' }}>
        <Card alignItems='flex-start' direction='column' flex={0.7} gap='md'>
          <Dt color='grey-50' size='s'>
            <Trans>Rewards</Trans>
          </Dt>
          <StrategyRewards wrap elementType='dd' incentives={strategy.info.incentives} />
        </Card>
        <Card alignItems='flex-start' direction='column' flex={0.3} gap='md'>
          <Dt color='grey-50' size='s'>
            <Trans>TVL</Trans>
          </Dt>
          <Dd color='light' size='lg' weight='semibold'>
            {strategy?.tvl ? format(strategy.tvl) : '-'}
          </Dd>
        </Card>
      </Flex>
      <Card direction='column' gap='xl' style={{ width: '100%' }}>
        <DlGroup alignItems='flex-start' direction='column'>
          <Dt color='grey-50' size='s'>
            <Trans>Description</Trans>
          </Dt>
          <Dd size='s'>{strategy.info.description}</Dd>
        </DlGroup>
        <Divider />
        <Flex gap='md'>
          <DlGroup alignItems='flex-start' direction='column' gap='xl' style={{ width: '100%' }}>
            <Dt color='grey-50' size='s'>
              <Trans>Strategy Breakdown</Trans>
            </Dt>
            <Flex
              alignItems='center'
              direction={{ base: 'column', s: 'row' }}
              elementType='dd'
              gap='2xl'
              justifyContent='center'
              style={{ width: '100%' }}
            >
              <Flex alignItems='center' gap='md'>
                <Avatar
                  alt='BTC'
                  size='5xl'
                  src='https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png'
                />
                <Flex direction='column'>
                  <Span color='grey-50' size='xs'>
                    Input
                  </Span>
                  <Span lineHeight='1.2'>BTC</Span>
                  <Span color='grey-50' size='s'>
                    Bitcoin
                  </Span>
                </Flex>
              </Flex>
              <StyledArrowLongRight />
              {strategy.contract.inputToken && (
                <Flex alignItems='center' gap='md'>
                  <ChainAsset
                    asset={
                      <Avatar
                        alt={strategy.contract.inputToken.symbol}
                        size='5xl'
                        src={strategy.contract.inputToken.logo}
                      />
                    }
                    chainId={L2_CHAIN}
                    chainProps={{ size: 'xs' }}
                  />
                  <Flex direction='column'>
                    <Span lineHeight='1.2'>{strategy.contract.inputToken.symbol}</Span>
                    <Link
                      external
                      icon
                      color='grey-50'
                      href={new URL(
                        `/address/${strategy.contract.inputToken?.address}`,
                        chainL2.blockExplorers?.default.url
                      ).toString()}
                      size='s'
                    >
                      {truncateEthAddress(strategy?.contract.inputToken?.address || '')}
                    </Link>
                  </Flex>
                </Flex>
              )}
              <StyledArrowLongRight />
              {strategy.contract.outputToken && (
                <Flex alignItems='center' gap='md'>
                  <ChainAsset
                    asset={
                      <Avatar
                        alt={strategy.contract.outputToken.symbol}
                        size='5xl'
                        src={strategy.contract.outputToken.logo}
                      />
                    }
                    chainId={L2_CHAIN}
                    chainProps={{ size: 'xs' }}
                  />
                  <Flex direction='column'>
                    <Span color='grey-50' size='xs'>
                      Output
                    </Span>
                    <Span lineHeight='1.2'>{strategy.contract.outputToken.symbol}</Span>
                    <Link
                      external
                      icon
                      color='grey-50'
                      href={new URL(
                        `/address/${strategy.contract.outputToken?.address}`,
                        chainL2.blockExplorers?.default.url
                      ).toString()}
                      size='s'
                    >
                      {truncateEthAddress(strategy?.contract.outputToken?.address || '')}
                    </Link>
                  </Flex>
                </Flex>
              )}
            </Flex>
          </DlGroup>
        </Flex>
        <Divider />
        <DlGroup alignItems='flex-start' direction='column' gap='lg'>
          <Dt color='grey-50' size='s'>
            <Trans>Additional Information</Trans>
          </Dt>
          <Flex wrap elementType='dd' gap={{ base: 'md', s: 'xl' }}>
            <Link external icon href={strategy.info.links.landingPage}>
              <Trans>Website</Trans>
            </Link>
            {strategy.info.links.securityReview && (
              <>
                <Link external icon href={strategy.info.links.securityReview}>
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

export { StrategyDetails };
