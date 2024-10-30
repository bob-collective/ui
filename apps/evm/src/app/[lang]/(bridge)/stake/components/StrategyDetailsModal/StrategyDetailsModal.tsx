import {
  Avatar,
  Button,
  Dd,
  Divider,
  Dl,
  DlGroup,
  Dt,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
  P
} from '@gobob/ui';
import { truncateEthAddress } from '@gobob/utils';
import { Fragment, useMemo } from 'react';
import { PellNetwork } from '@gobob/icons/src/PellNetwork';
import { Trans } from '@lingui/macro';

import { StrategyData } from '../StakeForm/StakeForm';

import { chainL2 } from '@/constants';

type Props = {
  strategy: StrategyData;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type StrategyDetailsModalProps = Props & InheritAttrs;

const strategyDetails = [
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

const StrategyDetailsModal = ({ strategy, onClose, ...props }: StrategyDetailsModalProps): JSX.Element => {
  const strategyData = useMemo(
    () => ({
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
    <Modal onClose={onClose} {...props}>
      <ModalHeader align='start'>
        <Trans>Asset Details</Trans>
      </ModalHeader>
      <ModalBody gap='2xl'>
        <Flex alignItems='center' direction={'column'} gap='s'>
          {strategy?.raw.integration.logo ? (
            <Avatar size='6xl' src={strategy?.raw.integration.logo} />
          ) : (
            <PellNetwork style={{ height: '3rem', width: '3rem' }} />
          )}
          <P color='grey-50' size='md'>
            {strategy?.raw.integration.name}
          </P>
        </Flex>
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
      </ModalBody>
      <ModalFooter>
        <Button color='primary' size='lg' onPress={onClose}>
          <Trans>Close</Trans>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { StrategyDetailsModal };
