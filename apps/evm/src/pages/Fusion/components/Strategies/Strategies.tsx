import { Card, Flex, H2, Link, P } from '@gobob/ui';

import { StrategyCard, StrategyCardProps } from './StrategyCard';
import { StyledGrid, StyledOverlay, StyledUnderlay, StyledWrapper } from './Strategies.style';

const btcLstLendingStrat: StrategyCardProps = {
  title: 'BTC LSTs Lending',
  shortDescription: 'Supply your BTC LSTs into a lending market on BOB',
  longDescription:
    'Deposit your BTC LSTs into a lending market on BOB and use them as collateral to borrow other assets.',
  steps: [
    { description: 'One-click stake your BTC and receive BTC LSTs on BOB' },
    { description: 'Deposit any eligible BTC LST into a lending market on BOB' },
    {
      description: 'Optional:',
      subSteps: [
        { description: 'Use the deposited BTC LST as collateral to borrow wBTC, tBTC or fBTC' },
        { description: 'Mint more BTC LSTs with the borrowed asset from step 3a' },
        { description: 'Deposit into lending as collateral' },
        { description: 'Repeat steps 3a to 3c multiple times' }
      ]
    }
  ],
  rewards: [
    'Lending rate of BTC LSTs on the Lending & Borrowing platform',
    'Spice rewards (Medium)',
    'Lending protocol rewards (multiplied by how often users repeat step 3)',
    'BTC LSTs points (multiplied by how often users repeat step 3)',
    'Babylon points (multiplied by how often users repeat step 3)'
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
    { description: 'One-click stake your BTC and receive BTC LSTs on BOB' },
    { description: 'Deposit your BTC LSTs into Satoshi Protocol to mint satUSD' },
    { description: 'Supply the newly minted satUSD into a lending protocol on BOB (insert list/links to dApps)' },
    {
      description: 'Optional:',
      subSteps: [
        { description: 'Use the deposited satUSD as collateral to borrow any BTC LST' },
        { description: 'Mint more satUSD with the borrowed asset from step 4a' },
        { description: 'Deposit into lending as collateral' },
        { description: 'Repeat steps 4a to 4c multiple times' }
      ]
    }
  ],
  rewards: [
    'Lending rate of satUSD',
    'Spice rewards (Medium)',
    'Lending protocol rewards (multiplied by how often users repeat step 4)',
    'Satoshi protocol rewards (multiplied by how often users repeat step 4)',
    'BTC LSTs points (multiplied by how often users repeat step 4)',
    'Babylon points (multiplied by how often users repeat step 4)'
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
          to provide liquity into a DEX pool on Oku. Users will need to actively monitor their position, especially if
          the position has a small range
        </>
      )
    }
  ],
  rewards: [
    'Spice rewards (High)',
    'BTC LST points (if BTC LSTs are supplied)',
    'Babylon points (if BTC LSTs are supplied)'
  ]
};

const strategies = [btcLstLendingStrat, mintAndLendSatUsd, dexLiquidityPovisioning];

type StrategiesProps = {};

const isComingSoon = true;

const Strategies = ({}: StrategiesProps) => {
  return (
    <Flex direction='column' gap='3xl'>
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
