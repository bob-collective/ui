import { Flex, Avatar, Chip, FlexProps } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { ReactNode } from 'react';
import { Babylon, PellNetwork, Spice } from '@gobob/icons';

import { stakingInfo, Incentive } from '../../../utils/stakeData';

const SpiceRewards = () => (
  <Chip background='primary-500' size='s' startAdornment={<Spice size='xs' />}>
    <Trans>Spice</Trans>
  </Chip>
);

const PellPoints = () => (
  <Chip background='dark' size='s' startAdornment={<PellNetwork size='xs' />}>
    <Trans>Points</Trans>
  </Chip>
);

const BedrockDiamond = () => (
  <Chip
    background='blue-800'
    size='s'
    startAdornment={
      <Avatar size='xl' src='https://raw.githubusercontent.com/bob-collective/bob/master/assets/uniBTC.svg' />
    }
  >
    <Trans>Diamond</Trans>
  </Chip>
);

const SegmentPoints = () => (
  <Chip
    size='s'
    startAdornment={
      <Avatar size='xl' src='https://raw.githubusercontent.com/bob-collective/bob/master/assets/segment.svg' />
    }
    style={{ backgroundColor: '#2C3CFE' }}
  >
    <Trans>Points</Trans>
  </Chip>
);

const BabylonPoints = () => (
  <Chip background='dark' size='s' startAdornment={<Babylon size='xs' />}>
    <Trans>Points</Trans>
  </Chip>
);

const SolvXP = () => (
  <Chip
    size='s'
    startAdornment={<Avatar size='2xl' src='https://static.gobob.xyz/logos/SOLV%20LOGO%20purple.png' />}
    style={{ backgroundColor: '#301F5E' }}
  >
    <Trans>Solv XP</Trans>
  </Chip>
);

const SupplyApr = () => (
  <Chip background='grey-800' size='s'>
    <Trans>Supply APR</Trans>
  </Chip>
);

const incentivesMap: Record<Incentive, () => ReactNode> = {
  [Incentive.babylon]: BabylonPoints,
  [Incentive.bedrock]: BedrockDiamond,
  [Incentive.pell]: PellPoints,
  [Incentive.segment]: SegmentPoints,
  [Incentive.solv]: SolvXP,
  [Incentive.spice]: SpiceRewards,
  [Incentive.supply]: SupplyApr
};

type Props = {
  slug: string;
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type StakeRewardsProps = Props & InheritAttrs;

const StakeRewards = ({ slug, ...props }: StakeRewardsProps) => (
  <Flex gap='xs' {...props}>
    <SpiceRewards />
    {stakingInfo[slug]?.incentives.map((incentive, key) => {
      const Comp = incentivesMap[incentive];

      return <Comp key={key} />;
    })}
  </Flex>
);

export { StakeRewards };
