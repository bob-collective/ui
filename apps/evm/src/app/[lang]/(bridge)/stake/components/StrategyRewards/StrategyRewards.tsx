import { Babylon, PellNetwork, Spice } from '@gobob/icons';
import { Avatar, Chip, Flex, FlexProps } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { ReactNode } from 'react';

import { StrategyIncentive } from '../../constants';

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

const AvalonPoints = () => (
  <Chip
    background='dark'
    size='s'
    startAdornment={<Avatar size='xl' src='https://static.gobob.xyz/logos/Untitled.png' />}
  >
    <Trans>Points</Trans>
  </Chip>
);

const incentivesMap: Record<StrategyIncentive, () => ReactNode> = {
  [StrategyIncentive.Babylon]: BabylonPoints,
  [StrategyIncentive.Bedrock]: BedrockDiamond,
  [StrategyIncentive.Pell]: PellPoints,
  [StrategyIncentive.Segment]: SegmentPoints,
  [StrategyIncentive.Solv]: SolvXP,
  [StrategyIncentive.Spice]: SpiceRewards,
  [StrategyIncentive.Supply]: SupplyApr,
  [StrategyIncentive.Avalon]: AvalonPoints
};

type Props = {
  incentives: StrategyIncentive[];
};

type InheritAttrs = Omit<FlexProps, keyof Props>;

type StrategyRewardsProps = Props & InheritAttrs;

const StrategyRewards = ({ incentives, ...props }: StrategyRewardsProps) => (
  <Flex wrap gap='xs' {...props}>
    <SpiceRewards />
    {incentives.map((incentive, key) => {
      const Comp = incentivesMap[incentive];

      return <Comp key={key} />;
    })}
  </Flex>
);

export { StrategyRewards };
