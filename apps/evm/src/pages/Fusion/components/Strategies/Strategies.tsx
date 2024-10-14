/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, Flex, H2, Link, P } from '@gobob/ui';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

import { RoutesPath } from '../../../../constants';

import { StrategyCard, StrategyCardProps } from './StrategyCard';
import { StyledGrid, StyledOverlay, StyledUnderlay, StyledWrapper } from './Strategies.style';

const btcLstLendingStrat: StrategyCardProps = {
  title: i18next.t('fusion.strategies.btcLstLendingStrat.title'),
  shortDescription: i18next.t('fusion.strategies.btcLstLendingStrat.shortDescription'),
  longDescription: i18next.t('fusion.strategies.btcLstLendingStrat.longDescription'),
  steps: [
    {
      description: (
        <>
          <Link href={RoutesPath.STAKE} underlined='always'>
            {i18next.t('fusion.strategies.btcLstLendingStrat.steps.one.linkText')}
          </Link>{' '}
          {i18next.t('fusion.strategies.btcLstLendingStrat.steps.one.description')}
        </>
      )
    },
    { description: i18next.t('fusion.strategies.btcLstLendingStrat.steps.two.description') },
    {
      description: i18next.t('fusion.strategies.btcLstLendingStrat.steps.three.description')
    },
    { description: i18next.t('fusion.strategies.btcLstLendingStrat.steps.four.description') },
    { description: i18next.t('fusion.strategies.btcLstLendingStrat.steps.five.description') }
  ],
  rewards: [
    i18next.t('fusion.strategies.btcLstLendingStrat.rewards.one'),
    i18next.t('fusion.strategies.btcLstLendingStrat.rewards.two'),
    i18next.t('fusion.strategies.btcLstLendingStrat.rewards.three'),
    i18next.t('fusion.strategies.btcLstLendingStrat.rewards.four'),
    i18next.t('fusion.strategies.btcLstLendingStrat.rewards.five')
  ]
};

const mintAndLendSatUsd: StrategyCardProps = {
  title: i18next.t('fusion.strategies.mintAndLendSatUsd.title'),
  shortDescription: i18next.t('fusion.strategies.mintAndLendSatUsd.shortDescription'),
  longDescription: (
    <>
      {i18next.t('fusion.strategies.mintAndLendSatUsd.longDescription.prefix')}
      <Link external color='inherit' href='https://app.satoshiprotocol.org/' size='inherit' underlined='always'>
        {i18next.t('fusion.strategies.mintAndLendSatUsd.longDescription.linkText')}
      </Link>{' '}
      {i18next.t('fusion.strategies.mintAndLendSatUsd.longDescription.suffix')}
    </>
  ),
  steps: [
    {
      description: (
        <>
          <Link href={RoutesPath.STAKE} underlined='always'>
            {i18next.t('fusion.strategies.mintAndLendSatUsd.steps.one.linkText')}
          </Link>{' '}
          {i18next.t('fusion.strategies.mintAndLendSatUsd.steps.one.description')}
        </>
      )
    },
    {
      description: (
        <>
          {i18next.t('fusion.strategies.mintAndLendSatUsd.steps.two.prefix')}{' '}
          <Link external color='inherit' href='https://app.satoshiprotocol.org/' size='inherit' underlined='always'>
            {i18next.t('fusion.strategies.mintAndLendSatUsd.steps.two.linkText')}
          </Link>{' '}
          {i18next.t('fusion.strategies.mintAndLendSatUsd.steps.two.suffix')}
        </>
      )
    },
    {
      description: (
        <>
          {i18next.t('fusion.strategies.mintAndLendSatUsd.steps.three.prefix')}{' '}
          <Link
            color='inherit'
            href={`${RoutesPath.APPS}?category=Lending+%26+Borrowing`}
            size='inherit'
            underlined='always'
          >
            {i18next.t('fusion.strategies.mintAndLendSatUsd.steps.three.linkText')}
          </Link>
          {i18next.t('fusion.strategies.mintAndLendSatUsd.steps.three.suffix')}
        </>
      )
    },
    {
      description: i18next.t('fusion.strategies.mintAndLendSatUsd.steps.four.description')
    },
    {
      description: i18next.t('fusion.strategies.mintAndLendSatUsd.steps.five.description')
    }
  ],
  rewards: [
    i18next.t('fusion.strategies.mintAndLendSatUsd.rewards.one'),
    i18next.t('fusion.strategies.mintAndLendSatUsd.rewards.two'),
    i18next.t('fusion.strategies.mintAndLendSatUsd.rewards.three'),
    i18next.t('fusion.strategies.mintAndLendSatUsd.rewards.four'),
    i18next.t('fusion.strategies.mintAndLendSatUsd.rewards.five'),
    i18next.t('fusion.strategies.mintAndLendSatUsd.rewards.six')
  ]
};

const dexLiquidityPovisioning: StrategyCardProps = {
  title: i18next.t('fusion.strategies.dexLiquidityPovisioning.title'),
  shortDescription: i18next.t('fusion.strategies.dexLiquidityPovisioning.shortDescription'),
  longDescription: (
    <>
      {i18next.t('fusion.strategies.dexLiquidityPovisioning.longDescription.prefix')}{' '}
      <Link
        external
        color='inherit'
        href='https://oku.trade/app/bob/?utm_source=BOB'
        size='inherit'
        underlined='always'
      >
        {i18next.t('fusion.strategies.dexLiquidityPovisioning.longDescription.linkText')}
      </Link>{' '}
      {i18next.t('fusion.strategies.dexLiquidityPovisioning.longDescription.suffix')}
    </>
  ),
  steps: [
    {
      description: (
        <>
          {i18next.t('fusion.strategies.dexLiquidityPovisioning.steps.one.prefix')}{' '}
          <Link
            external
            color='inherit'
            href='https://docs.oku.trade/home/features/position-manager'
            size='inherit'
            underlined='always'
          >
            {i18next.t('fusion.strategies.dexLiquidityPovisioning.steps.one.linkText')}
          </Link>{' '}
          {i18next.t('fusion.strategies.dexLiquidityPovisioning.steps.one.suffix')}
        </>
      )
    },
    { description: i18next.t('fusion.strategies.dexLiquidityPovisioning.steps.two.description') },
    { description: i18next.t('fusion.strategies.dexLiquidityPovisioning.steps.three.description') }
  ],
  rewards: [
    i18next.t('fusion.strategies.dexLiquidityPovisioning.rewards.one'),
    i18next.t('fusion.strategies.dexLiquidityPovisioning.rewards.two'),
    i18next.t('fusion.strategies.dexLiquidityPovisioning.rewards.three')
  ]
};

const bridgeBtcLstToBob: StrategyCardProps = {
  title: i18next.t('fusion.strategies.bridgeBtcLstToBob.title'),
  shortDescription: i18next.t('fusion.strategies.bridgeBtcLstToBob.shortDescription'),
  longDescription: i18next.t('fusion.strategies.bridgeBtcLstToBob.longDescription'),
  steps: [
    {
      description: (
        <>
          {i18next.t('fusion.strategies.bridgeBtcLstToBob.steps.one.prefix')}{' '}
          <Link
            external
            color='inherit'
            href={`${RoutesPath.STAKE}?type=stake&stakeWith=solv-solvbtcbbn`}
            size='inherit'
            underlined='always'
          >
            {i18next.t('fusion.strategies.bridgeBtcLstToBob.steps.one.linkText')}
          </Link>
          {i18next.t('fusion.strategies.bridgeBtcLstToBob.steps.one.suffix')}
        </>
      )
    },
    { description: i18next.t('fusion.strategies.bridgeBtcLstToBob.steps.two.description') },
    { description: i18next.t('fusion.strategies.bridgeBtcLstToBob.steps.three.description') }
  ],
  rewards: [
    i18next.t('fusion.strategies.bridgeBtcLstToBob.rewards.one'),
    i18next.t('fusion.strategies.bridgeBtcLstToBob.rewards.two'),
    i18next.t('fusion.strategies.bridgeBtcLstToBob.rewards.three')
  ]
};

const strategies = [btcLstLendingStrat, mintAndLendSatUsd, dexLiquidityPovisioning, bridgeBtcLstToBob].slice(0, 3);

type StrategiesProps = {};

const isComingSoon = false;

const Strategies = ({}: StrategiesProps) => {
  const { t } = useTranslation();

  return (
    <Flex direction='column' gap='3xl' style={{ width: '100%' }}>
      <H2 size='3xl'>{t('fusion.strategies.title')}</H2>
      <StyledWrapper>
        {isComingSoon && (
          <>
            <StyledUnderlay />
            <StyledOverlay alignItems='center' justifyContent='center'>
              <Card borderColor='grey-300' paddingX='lg' paddingY='md' rounded='md'>
                <P size='xl'>{t('fusion.strategies.comingSoon')}</P>
              </Card>
            </StyledOverlay>
          </>
        )}
        <StyledGrid gap='2xl'>
          {strategies.map((strat, idx) => (
            <StrategyCard key={idx} isDisabled={isComingSoon} {...strat} />
          ))}
        </StyledGrid>
      </StyledWrapper>
    </Flex>
  );
};

export { Strategies };
