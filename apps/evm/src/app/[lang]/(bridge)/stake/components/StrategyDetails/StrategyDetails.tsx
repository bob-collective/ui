import { Avatar, CardProps, Dd, Divider, Dl, DlGroup, Dt, Flex, Link, P, Spinner } from '@gobob/ui';
import { truncateEthAddress } from '@gobob/utils';
import { Fragment, useMemo } from 'react';
import { PellNetwork } from '@gobob/icons/src/PellNetwork';
import { Trans } from '@lingui/macro';

import { StrategyData } from '../StakeForm/StakeForm';

import { StyledSection, StyledStrategyDetails } from './StrategyDetails.style';

import { chainL2 } from '@/constants';

type TransactionListProps = CardProps & {
  strategy: StrategyData | undefined;
  isLoading?: boolean;
};

const strategyDetails = [
  { key: 'name', name: <Trans>Name</Trans> },
  { key: 'category', name: <Trans>Category</Trans> },
  { key: 'website', name: <Trans>Website</Trans> },
  { key: 'incentives', name: <Trans>Incentives</Trans> },
  { key: 'token', name: <Trans>Staking Token</Trans> },
  { key: 'about', name: <Trans>About</Trans> }
] as const;

const stakingInfo = {
  'bedrock-unibtc': {
    category: <Trans>Liquid Staking</Trans>,
    website: 'https://app.bedrock.technology/unibtc',
    incentives: <Trans>Spice + Bedrock Diamonds + Babylon Points</Trans>,
    about: (
      <Trans>
        uniBTC represents the staked wBTC plus all future staking rewards and accrual of Babylon staking rewards and
        Bedrock diamonds.
      </Trans>
    )
  },
  'pell-solvbtcbbn': {
    category: <Trans>Restaking</Trans>,
    website: 'https://app.pell.network/restake',
    incentives: <Trans>Spice + Pell Points + Solv XP + Babylon Points</Trans>,
    about: (
      <Trans>Restake SolvBTC.BBN into Pell to secure actively validated services via proof of stake mechanism.</Trans>
    )
  },
  'pell-unibtc': {
    category: <Trans>Restaking</Trans>,
    website: 'https://app.pell.network/restake',
    incentives: <Trans>Spice + Pell Points + Bedrock Diamond + Babylon Points</Trans>,
    about: <Trans>Restake uniBTC into Pell to secure actively validated services via proof of stake mechanism.</Trans>
  },
  'segment-tbtc': {
    category: <Trans>Lending</Trans>,
    website: 'https://app.segment.finance/#/',
    incentives: <Trans>Spice + Segment Points + Supply APR</Trans>,
    about: <Trans>Supply tBTC into Segment to earn interest.</Trans>
  },
  'segment-wbtc': {
    category: <Trans>Lending</Trans>,
    website: 'https://app.segment.finance/#/',
    incentives: <Trans>Spice + Segment Points + Supply APR</Trans>,
    about: <Trans>Supply wBTC into Segment to earn interest.</Trans>
  },
  'segment-sesolvbtcbbn': {
    category: <Trans>Lending</Trans>,
    website: 'https://app.segment.finance/#/',
    incentives: <Trans>Spice + Segment Points + Supply APR + Solv XP + Babylon Points</Trans>,
    about: <Trans>Supply seSOLVBTCBBN into Segment to earn interest.</Trans>
  },
  'segment-seunibtc': {
    category: <Trans>Lending</Trans>,
    website: 'https://app.segment.finance/#/',
    incentives: <Trans>Spice + Segment Points + Supply APR + Bedrock Diamonds + Babylon Points</Trans>,
    about: <Trans>Supply seUNIBTC into Segment to earn interest.</Trans>
  },
  'shoebill-tbtc': {
    category: <Trans>Lending</Trans>,
    website: 'https://bob-btc.shoebill.finance/#/',
    incentives: <Trans>Spice + Shoebill Points + Supply APR</Trans>,
    about: <Trans>Supply tBTC into Shoebill to earn interest.</Trans>
  },
  'shoebill-wbtc': {
    category: <Trans>Lending</Trans>,
    website: 'https://bob-btc.shoebill.finance/#/',
    incentives: <Trans>Spice + Shoebill Points + Supply APR</Trans>,
    about: <Trans>Supply wBTC into Shoebill to earn interest.</Trans>
  },
  'solv-solvbtcbbn': {
    category: <Trans>Liquid Staking</Trans>,
    website: 'https://app.solv.finance/babylon?network=bob',
    incentives: <Trans>Spice + Solv XP + Babylon Points</Trans>,
    about: (
      <Trans>
        SolvBTC.BBN is a yield-bearing token that represents staked SolvBTC plus all future Babylon staking rewards and
        Solv Points.
      </Trans>
    )
  }
};

const stakingInfoAny = stakingInfo as Record<string, (typeof stakingInfo)[keyof typeof stakingInfo] | undefined>;

const getWebsiteUrl = (strategy: StrategyData | undefined) => {
  const websiteUrl = stakingInfoAny[strategy?.raw.integration.slug ?? '']?.website;

  return websiteUrl ? (
    <Link external color='grey-50' href={websiteUrl} size='md' underlined='always'>
      {websiteUrl}
    </Link>
  ) : undefined;
};

const StrategyDetails = ({ isLoading = false, strategy, ...props }: TransactionListProps): JSX.Element => {
  const strategyData = useMemo(
    () => ({
      name: (
        <Flex alignItems='center' gap='s'>
          {strategy?.raw.integration.logo ? (
            <Avatar size='2xl' src={strategy?.raw.integration.logo} />
          ) : (
            <PellNetwork />
          )}
          <P color='grey-50' size='md'>
            {strategy?.raw.integration.name}
          </P>
        </Flex>
      ),
      category: stakingInfoAny[strategy?.raw.integration.slug ?? '']?.category,
      website: getWebsiteUrl(strategy),
      incentives: stakingInfoAny[strategy?.raw.integration.slug ?? '']?.incentives,
      token: strategy?.raw.outputToken?.address ? (
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
          {truncateEthAddress(strategy?.raw.outputToken?.address)}
        </Link>
      ) : undefined,
      about: stakingInfoAny[strategy?.raw.integration.slug ?? '']?.about
    }),
    [strategy]
  );

  return (
    <StyledSection padding='2xl' {...props}>
      <StyledStrategyDetails
        direction='column'
        flex={1}
        gap='xl'
        justifyContent={isLoading || !strategy ? 'center' : undefined}
      >
        {isLoading || !strategy ? (
          <Flex alignItems='center' gap='md' justifyContent='center'>
            <Spinner size='16' thickness={2} />
            <P align='center' size='xs'>
              <Trans>Fetching staking strategies...</Trans>
            </P>
          </Flex>
        ) : (
          <Dl direction='column' gap='lg'>
            {strategyDetails.map(({ key, name }, index) => (
              <Fragment key={key}>
                {index !== 0 && <Divider />}
                <DlGroup alignItems='center' justifyContent='space-between'>
                  <Dd size='md' style={{ minWidth: '15ch' }}>
                    {name}
                  </Dd>
                  <Dt style={{ textAlign: 'right', wordBreak: 'break-word' }}>{strategyData[key] ?? '~'}</Dt>
                </DlGroup>
              </Fragment>
            ))}
          </Dl>
        )}
      </StyledStrategyDetails>
    </StyledSection>
  );
};

export { StrategyDetails };
