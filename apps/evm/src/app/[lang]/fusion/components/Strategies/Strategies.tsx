/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, Flex, H2, Link, P } from '@gobob/ui';
import { Trans, t } from '@lingui/macro';
import { I18n } from '@lingui/core';
import { useLingui } from '@lingui/react';

import { StrategyCard, StrategyCardProps } from './StrategyCard';
import { StyledGrid, StyledOverlay, StyledUnderlay, StyledWrapper } from './Strategies.style';

import { RoutesPath } from '@/constants';

const getBTCLstLendingStrat = (i18n: I18n): StrategyCardProps => ({
  title: t(i18n)`BTC LST Lending`,
  shortDescription: t(i18n)`Use BTC LSTs as collateral to borrow other assets`,
  longDescription: t(
    i18n
  )`Deposit BTC LSTs into a lending market on BOB and use them as collateral to borrow other assets.`,
  steps: [
    {
      description: (
        <Trans>
          <Link href={RoutesPath.STAKE} underlined='always'>
            Stake your BTC with 1-click
          </Link>{' '}
          and receive BTC LSTs on BOB.
        </Trans>
      )
    },
    { description: t(i18n)`Deposit any eligible BTC LSTs into a lending market on BOB.` },
    {
      description: t(i18n)`Use the deposited BTC LSTs as collateral to borrow wBTC, tBTC or FBTC.`
    },
    { description: t(i18n)`Mint more BTC LSTs with these borrowed assets.` },
    { description: t(i18n)`Optional: It's possible to repeat steps 2-4 multiple times.` }
  ],
  rewards: [
    t(i18n)`Spice points (Medium)`,
    t(i18n)`Lending rate of BTC LSTs`,
    t(i18n)`Lending protocol points`,
    t(i18n)`LST provider points`,
    t(i18n)`Babylon points`
  ]
});

const getMintAndLendSatUsd = (i18n: I18n): StrategyCardProps => ({
  title: t(i18n)`Mint and Lend satUSD`,
  shortDescription: t(i18n)`Mint satUSD and supply it into a lending market on BOB`,
  longDescription: (
    <Trans>
      Deposit your BTC LSTs into{' '}
      <Link external color='inherit' href='https://app.satoshiprotocol.org/' size='inherit' underlined='always'>
        Satoshi Protocol
      </Link>{' '}
      to mint satUSD and deposit that into a lending market on BOB
    </Trans>
  ),
  steps: [
    {
      description: (
        <Trans>
          <Link href={RoutesPath.STAKE} underlined='always'>
            Stake your BTC with 1-click
          </Link>{' '}
          and receive BTC LSTs on BOB.
        </Trans>
      )
    },
    {
      description: (
        <Trans>
          Deposit your BTC LSTs into{' '}
          <Link external color='inherit' href='https://app.satoshiprotocol.org/' size='inherit' underlined='always'>
            Satoshi Protocol
          </Link>{' '}
          to mint satUSD.
        </Trans>
      )
    },
    {
      description: (
        <Trans>
          Supply the newly minted satUSD into a{' '}
          <Link
            color='inherit'
            href={`${RoutesPath.APPS}?category=Lending+%26+Borrowing`}
            size='inherit'
            underlined='always'
          >
            lending protocol on BOB
          </Link>
          .
        </Trans>
      )
    },
    {
      description: t(i18n)`Use the deposited satUSD as collateral to borrow any BTC LST.`
    },
    {
      description: t(i18n)`Optional: It's possible to repeat steps 2-4 multiple times.`
    }
  ],
  rewards: [
    t(i18n)`Spice rewards (Medium)`,
    t(i18n)`Lending rate of satUSD`,
    t(i18n)`Lending protocol points`,
    t(i18n)`Satoshi protocol points`,
    t(i18n)`LST provider points`,
    t(i18n)`Babylon points`
  ]
});

const getDexLiquidityPovisioning = (i18n: I18n): StrategyCardProps => ({
  title: t(i18n)`DEX Liquidity Provisioning`,
  shortDescription: t(i18n)`Provide liquidity into Oku DEX`,
  longDescription: (
    <Trans>
      Provide liquidity into any AMM pool on{' '}
      <Link
        external
        color='inherit'
        href='https://oku.trade/app/bob/?utm_source=BOB'
        size='inherit'
        underlined='always'
      >
        Oku DEX
      </Link>{' '}
      to earn trading fees and incentives
    </Trans>
  ),
  steps: [
    {
      description: (
        <Trans>
          Follow the steps of{' '}
          <Link
            external
            color='inherit'
            href='https://docs.oku.trade/home/features/position-manager'
            size='inherit'
            underlined='always'
          >
            this guide
          </Link>{' '}
          to provide liquity into a DEX pool on Oku.
        </Trans>
      )
    },
    { description: t(i18n)`Maximum points will be received by providing BTC LST liquidity.` },
    { description: t(i18n)`You will need to actively monitor your position, especially if it has a small range.` }
  ],
  rewards: [t(i18n)`Spice rewards (Higher)`, t(i18n)`LST provider points`, t(i18n)`Babylon points`]
});

const getBridgeBtcLstToBob = (i18n: I18n): StrategyCardProps => ({
  title: t(i18n)`Bridge BTC LSTs to BOB`,
  shortDescription: t(i18n)`Bridge BTC LSTs to BOB`,
  longDescription: t(
    i18n
  )`If you already own BTC LSTs on other chains, you can bridge them over to BOB and start harvesting Spice.`,
  steps: [
    {
      description: (
        <Trans>
          Use any of the{' '}
          <Link
            external
            color='inherit'
            href={`${RoutesPath.STAKE}?type=stake&stake-with=solv-solvbtcbbn`}
            size='inherit'
            underlined='always'
          >
            supported bridges
          </Link>
          .
        </Trans>
      )
    },
    { description: t(i18n)`Select the wrapped Bitcoin asset and the amount that you want to bridge.` },
    { description: t(i18n)`Chose any of the existing liquid staking provider to mint your BTC LST.` }
  ],
  rewards: [t(i18n)`Spice points (Lower)`, t(i18n)`LST provider points`, t(i18n)`Babylon points`]
});

const strategies = [
  getBTCLstLendingStrat,
  getMintAndLendSatUsd,
  getDexLiquidityPovisioning,
  getBridgeBtcLstToBob
].slice(0, 3);

type StrategiesProps = object;

const isComingSoon = false;

const Strategies = ({}: StrategiesProps) => {
  const { i18n } = useLingui();

  return (
    <Flex direction='column' gap='3xl' style={{ width: '100%' }}>
      <H2 align='center' size='3xl'>
        <Trans>Hot Strategies</Trans>
      </H2>
      <StyledWrapper>
        {isComingSoon && (
          <>
            <StyledUnderlay />
            <StyledOverlay alignItems='center' justifyContent='center'>
              <Card borderColor='grey-300' paddingX='lg' paddingY='md' rounded='md'>
                <P size='xl'>
                  <Trans>Coming Soon</Trans>
                </P>
              </Card>
            </StyledOverlay>
          </>
        )}
        <StyledGrid gap='2xl'>
          {strategies.map((strat, idx) => (
            <StrategyCard key={idx} isDisabled={isComingSoon} {...strat(i18n)} />
          ))}
        </StyledGrid>
      </StyledWrapper>
    </Flex>
  );
};

export { Strategies };
