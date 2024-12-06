import { PellNetwork } from '@gobob/icons';
import { Avatar, Button, Flex, Span, Table, useCurrencyFormatter } from '@gobob/ui';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ReactNode, useEffect, useMemo, useState } from 'react';

import { stakingInfo, StakingInfo } from '../../../utils/stakeData';
import { StrategyData, useGetStakingStrategies } from '../../hooks';
import { StakeRewards } from '../StakeRewards';
import { StrategyModal } from '../StrategyModal';

const StrategyCell = ({ name, protocol }: { protocol: string; name: string }) => (
  <Flex alignItems='flex-start' direction='column'>
    <Span size='s' weight='bold'>
      {name}
    </Span>
    <Span color='grey-50' size='s' weight='medium'>
      {protocol}
    </Span>
  </Flex>
);

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

  const sortedStrategies = useMemo(() => [...strategies].sort((a, b) => (b?.tvl || 0) - (a?.tvl || 0)), [strategies]);

  useEffect(() => {
    if (!strategies || !urlSearchParams) return;

    const receive = urlSearchParams.get('receive');
    const validStrategy = strategies.find((strategy) => strategy.raw.integration.slug === receive);

    setStrategy(validStrategy);
  }, [urlSearchParams, strategies]);

  const rows: StakeTableRow[] = useMemo(
    () =>
      sortedStrategies.map((strategy, idx) => {
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
            <StakeRewards direction={{ base: 'column', md: 'row' }} slug={strategy?.raw.integration.slug ?? ''} />
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
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sortedStrategies]
  );

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
