import { Avatar, CardProps, Dd, Divider, Dl, DlGroup, Dt, Flex, Link, P, Spinner } from '@gobob/ui';
import { truncateEthAddress } from '@gobob/utils';
import { Fragment, useMemo } from 'react';
import { PellNetwork } from '@gobob/icons/src/PellNetwork';

import { chainL2 } from '../../../../constants';
import { StrategyData } from '../StakeForm/StakeForm';

import { StyledSection, StyledStrategyDetails } from './StrategyDetails.style';

type TransactionListProps = CardProps & {
  strategy: StrategyData | undefined;
  isLoading?: boolean;
};

const strategyDetails = [
  { key: 'name', name: 'Name' },
  { key: 'category', name: 'Category' },
  { key: 'website', name: 'Website' },
  { key: 'incentives', name: 'Incentives' },
  { key: 'token', name: 'Staking Token' },
  { key: 'about', name: 'About' }
] as const;

const stakingInfo = {
  'bedrock-unibtc': {
    category: 'Liquid Staking',
    website: 'https://app.bedrock.technology/unibtc',
    incentives: 'Spice + Bedrock Diamonds + Babylon Points',
    about:
      'uniBTC represents the staked wBTC plus all future staking rewards and accrual of Babylon staking rewards and Bedrock diamonds.'
  },
  'pell-solvbtcbbn': {
    category: 'Restaking',
    website: 'https://app.pell.network/restake',
    incentives: 'Spice + Pell Points + Solv XP + Babylon Points',
    about: 'Restake SolvBTC.BBN into Pell to secure actively validated services via proof of stake mechanism.'
  },
  'pell-unibtc': {
    category: 'Restaking',
    website: 'https://app.pell.network/restake',
    incentives: 'Spice + Pell Points + Bedrock Diamond + Babylon Points',
    about: 'Restake uniBTC into Pell to secure actively validated services via proof of stake mechanism.'
  },
  'segment-tbtc': {
    category: 'Lending',
    website: 'https://app.segment.finance/#/',
    incentives: 'Spice + Segment Points + Supply APR',
    about: 'Supply tBTC into Segment to earn interest.'
  },
  'segment-wbtc': {
    category: 'Lending',
    website: 'https://app.segment.finance/#/',
    incentives: 'Spice + Segment Points + Supply APR',
    about: 'Supply wBTC into Segment to earn interest.'
  },
  'segment-sesolvbtcbbn': {
    category: 'Lending',
    website: 'https://app.segment.finance/#/',
    incentives: 'Spice + Segment Points + Supply APR + Solv XP + Babylon Points',
    about: 'Supply seSOLVBTCBBN into Segment to earn interest.'
  },
  'segment-seunibtc': {
    category: 'Lending',
    website: 'https://app.segment.finance/#/',
    incentives: 'Spice + Segment Points + Supply APR + Bedrock Diamonds + Babylon Points',
    about: 'Supply seUNIBTC into Segment to earn interest.'
  },
  'shoebill-tbtc': {
    category: 'Lending',
    website: 'https://bob-btc.shoebill.finance/#/',
    incentives: 'Spice + Shoebill Points + Supply APR',
    about: 'Supply tBTC into Shoebill to earn interest.'
  },
  'shoebill-wbtc': {
    category: 'Lending',
    website: 'https://bob-btc.shoebill.finance/#/',
    incentives: 'Spice + Shoebill Points + Supply APR',
    about: 'Supply wBTC into Shoebill to earn interest.'
  },
  'solv-solvbtcbbn': {
    category: 'Liquid Staking',
    website: 'https://app.solv.finance/babylon?network=bob',
    incentives: 'Spice + Solv XP + Babylon Points',
    about:
      'SolvBTC.BBN is a yield-bearing token that represents staked SolvBTC plus all future Babylon staking rewards and Solv Points.'
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
              Fetching staking strategies...
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