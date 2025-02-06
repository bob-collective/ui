import { Avalon, Babylon, PellNetwork, Segment, Solv, Spice, UniBTC } from '@gobob/icons';
import { Chip, Flex, FlexProps } from '@gobob/ui';
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
  <Chip background='blue-800' size='s' startAdornment={<UniBTC size='s' />}>
    <Trans>Diamond</Trans>
  </Chip>
);

const SegmentPoints = () => (
  <Chip size='s' startAdornment={<Segment size='s' />} style={{ backgroundColor: '#2C3CFE' }}>
    <Trans>Points</Trans>
  </Chip>
);

const BabylonPoints = () => (
  <Chip background='dark' size='s' startAdornment={<Babylon size='xs' />}>
    <Trans>Points</Trans>
  </Chip>
);

const SolvXP = () => (
  <Chip size='s' startAdornment={<Solv size='xs' />} style={{ backgroundColor: '#301F5E' }}>
    <Trans>Solv XP</Trans>
  </Chip>
);

const SupplyApr = () => (
  <Chip background='grey-800' size='s'>
    <Trans>Supply APR</Trans>
  </Chip>
);

const AvalonPoints = () => (
  <Chip background='dark' size='s' startAdornment={<Avalon size='xs' />}>
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
