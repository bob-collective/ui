import { Table, Flex, Avatar, Button, Span, Chip, Card, useCurrencyFormatter } from '@gobob/ui';
import { Trans, t } from '@lingui/macro';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { PellNetwork, Spice } from '@gobob/icons';
import { useLingui } from '@lingui/react';

import { stakingInfo, StakingInfo } from '../../../utils/stakeData';
import { StrategyData, useGetStakingStrategies } from '../../hooks';
import { StrategyModal } from '../StrategyModal';

const SpiceRewards = () => (
  <Card background='primary-500' padding='xs' style={{ width: 'fit-content' }}>
    <Spice size='xs' />
  </Card>
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
  <Chip
    background='dark'
    size='s'
    startAdornment={<Avatar size='xl' src='https://avatars.githubusercontent.com/u/106378782?s=200&v=4' />}
  >
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

const StrategyCell = ({ name, protocol }: { protocol: string; name: string }) => (
  <Flex alignItems='flex-start' direction='column'>
    <Span size='xs' weight='bold'>
      {name}
    </Span>
    <Span color='grey-50' size='xs' weight='medium'>
      {protocol}
    </Span>
  </Flex>
);

enum Incentives {
  spice,
  pell,
  bedrock,
  segment,
  babylon,
  solv,
  supply
}

const incentivesMap: Record<Incentives, () => ReactNode> = {
  [Incentives.babylon]: BabylonPoints,
  [Incentives.bedrock]: BedrockDiamond,
  [Incentives.pell]: PellPoints,
  [Incentives.segment]: SegmentPoints,
  [Incentives.solv]: SolvXP,
  [Incentives.spice]: SpiceRewards,
  [Incentives.supply]: SupplyApr
};

enum StakeTableColumns {
  STRATEGY = 'strategy',
  REWARDS = 'incentives',
  TVL = 'tvl',
  ACTIONS = 'actions'
}

type StakeTableRow = {
  id: string;
  [StakeTableColumns.STRATEGY]: ReactNode;
  [StakeTableColumns.REWARDS]: ReactNode;
  [StakeTableColumns.TVL]: ReactNode;
  [StakeTableColumns.ACTIONS]: ReactNode;
};

const columns = [
  { name: <Trans>Strategy</Trans>, id: StakeTableColumns.STRATEGY, minWidth: 240 },
  { name: <Trans>Rewards</Trans>, id: StakeTableColumns.REWARDS },
  { name: <Trans>TVL (on BOB)</Trans>, id: StakeTableColumns.TVL, minWidth: 96 },
  { name: '', id: StakeTableColumns.ACTIONS }
];

const stakingInfoAny = stakingInfo as StakingInfo;

interface Props {
  searchParams?: { receive: string };
  onStakeSuccess: () => void;
}

const StakeTable = ({ searchParams, onStakeSuccess }: Props) => {
  const [strategy, setStrategy] = useState<StrategyData>();

  const { i18n } = useLingui();
  const format = useCurrencyFormatter();

  const urlSearchParams = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const { data: strategies = [] } = useGetStakingStrategies();

  const sortedStrategies = strategies.sort((a, b) => (b?.tvl || 0) - (a?.tvl || 0));

  useEffect(() => {
    if (!strategies || !urlSearchParams) return;

    const receive = urlSearchParams.get('receive');
    const validStrategy = strategies.find((strategy) => strategy.raw.integration.slug === receive);

    setStrategy(validStrategy);
  }, [urlSearchParams, strategies]);

  const rows: StakeTableRow[] = sortedStrategies.map((strategy, idx) => {
    return {
      id: `${strategy.raw.id}${idx}`,
      [StakeTableColumns.STRATEGY]: (
        <Flex alignItems='center' gap='lg'>
          {strategy.raw.integration.logo ? (
            <Avatar size={'2xl'} src={strategy.raw.integration.logo} />
          ) : (
            <PellNetwork style={{ height: '1.3rem', width: '1.3rem' }} />
          )}
          <StrategyCell
            name={stakingInfoAny[strategy?.raw.integration.slug ?? '']?.strategy as string}
            protocol={stakingInfoAny[strategy?.raw.integration.slug ?? '']?.protocol as string}
          />
        </Flex>
      ),
      [StakeTableColumns.REWARDS]: (
        <Flex direction={{ base: 'column', md: 'row' }} gap='xs'>
          <SpiceRewards />
          {stakingInfoAny[strategy?.raw.integration.slug ?? '']?.incentives.map((incentive, key) => {
            const Comp = incentivesMap[incentive];

            return <Comp key={key} />;
          })}
        </Flex>
      ),
      [StakeTableColumns.TVL]: strategy?.tvl ? format(strategy.tvl) : '-',
      [StakeTableColumns.ACTIONS]: (
        <Flex direction='row' gap='md'>
          <Button color='primary' onPress={() => setStrategy(strategy)}>
            <Trans>Stake</Trans>
          </Button>
          <Button
            variant='outline'
            onPress={() =>
              window.open(stakingInfoAny[strategy?.raw.integration.slug ?? '']?.website, '_blank', 'noreferrer')
            }
          >
            <Trans>Manage</Trans>
          </Button>
        </Flex>
      )
    };
  });

  return (
    <>
      <Table aria-label={t(i18n)`Staking table`} columns={columns} rows={rows} />
      {strategy && (
        <StrategyModal
          stakingInfo={stakingInfoAny[strategy?.raw.integration.slug]}
          strategy={strategy}
          onCloseModal={() => setStrategy(undefined)}
          onStakeSuccess={onStakeSuccess}
        />
      )}
    </>
  );
};

export { StakeTable };
