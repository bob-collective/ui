/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, Flex, H2, Link, P } from '@gobob/ui';

import { RoutesPath } from '../../../../constants';

import { StrategyCard, StrategyCardProps } from './StrategyCard';
import { StyledGrid, StyledOverlay, StyledUnderlay, StyledWrapper } from './Strategies.style';

const btcLstLendingStrat: StrategyCardProps = {
  title: 'BTC LST Lending',
  shortDescription: 'Use BTC LSTs as collateral to borrow other assets',
  longDescription: 'Deposit BTC LSTs into a lending market on BOB and use them as collateral to borrow other assets.',
  steps: [
    {
      description: (
        <>
          <Link href={RoutesPath.STAKE} underlined='always'>
            Stake your BTC with 1-click
          </Link>{' '}
          and receive BTC LSTs on BOB.
        </>
      )
    },
    { description: 'Deposit any eligible BTC LSTs into a lending market on BOB.' },
    {
      description: 'Use the deposited BTC LSTs as collateral to borrow wBTC, tBTC or FBTC.'
    },
    { description: 'Mint more BTC LSTs with these borrowed assets.' },
    { description: "Optional: It's possible to repeat steps 2-4 multiple times." }
  ],
  rewards: [
    'Spice points (Medium)',
    'Lending rate of BTC LSTs',
    'Lending protocol points',
    'LST provider points',
    'Babylon points'
  ]
};

const mintAndLendSatUsd: StrategyCardProps = {
  title: 'Mint and Lend satUSD',
  shortDescription: 'Mint satUSD and supply it into a lending market on BOB',
  longDescription: (
    <>
      Deposit your BTC LSTs into{' '}
      <Link external color='inherit' href='https://app.satoshiprotocol.org/' size='inherit' underlined='always'>
        Satoshi Protocol
      </Link>{' '}
      to mint satUSD and deposit that into a lending market on BOB
    </>
  ),
  steps: [
    {
      description: (
        <>
          <Link href={RoutesPath.STAKE} underlined='always'>
            Stake your BTC with 1-click
          </Link>{' '}
          and receive BTC LSTs on BOB.
        </>
      )
    },
    {
      description: (
        <>
          Deposit your BTC LSTs into{' '}
          <Link external color='inherit' href='https://app.satoshiprotocol.org/' size='inherit' underlined='always'>
            Satoshi Protocol
          </Link>{' '}
          to mint satUSD.
        </>
      )
    },
    {
      description: (
        <>
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
        </>
      )
    },
    {
      description: 'Use the deposited satUSD as collateral to borrow any BTC LST.'
    },
    {
      description: "Optional: It's possible to repeat steps 2-4 multiple times."
    }
  ],
  rewards: [
    'Spice rewards (Medium)',
    'Lending rate of satUSD',
    'Lending protocol points',
    'Satoshi protocol points',
    'LST provider points',
    'Babylon points'
  ]
};

const dexLiquidityPovisioning: StrategyCardProps = {
  title: 'DEX Liquidity Provisioning',
  shortDescription: 'Provide liquidity into Oku DEX',
  longDescription: (
    <>
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
    </>
  ),
  steps: [
    {
      description: (
        <>
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
        </>
      )
    },
    { description: 'Maximum points will be received by providing BTC LST liquidity.' },
    { description: 'You will need to actively monitor your position, especially if it has a small range.' }
  ],
  rewards: ['Spice rewards (Higher)', 'LST provider points', 'Babylon points']
};

const bridgeBtcLstToBob: StrategyCardProps = {
  title: 'Bridge BTC LSTs to BOB',
  shortDescription: 'Bridge BTC LSTs to BOB',
  longDescription:
    'If you already own BTC LSTs on other chains, you can bridge them over to BOB and start harvesting Spice.',
  steps: [
    {
      description: (
        <>
          Use any of the{' '}
          <Link
            external
            color='inherit'
            href={`${RoutesPath.STAKE}?type=stake&stakeWith=solv-solvbtcbbn`}
            size='inherit'
            underlined='always'
          >
            supported bridges
          </Link>
          .
        </>
      )
    },
    { description: 'Select the wrapped Bitcoin asset and the amount that you want to bridge.' },
    { description: 'Chose any of the existing liquid staking provider to mint your BTC LST.' }
  ],
  rewards: ['Spice points (Lower)', 'LST provider points', 'Babylon points']
};

const strategies = [btcLstLendingStrat, mintAndLendSatUsd, dexLiquidityPovisioning, bridgeBtcLstToBob].slice(0, 3);

type StrategiesProps = object;

const isComingSoon = false;

const Strategies = ({}: StrategiesProps) => {
  return (
    <Flex direction='column' gap='3xl' style={{ width: '100%' }}>
      <H2 size='3xl'>Hot Strategies</H2>
      <StyledWrapper>
        {isComingSoon && (
          <>
            <StyledUnderlay />
            <StyledOverlay alignItems='center' justifyContent='center'>
              <Card borderColor='grey-300' paddingX='lg' paddingY='md' rounded='md'>
                <P size='xl'>Coming Soon</P>
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
