import {
  Avatar,
  Card,
  Dd,
  Dl,
  DlGroup,
  Dt,
  Flex,
  InformationCircle,
  Item,
  List,
  ListItem,
  Select,
  Skeleton,
  Span,
  Table,
  Tabs,
  TabsItem,
  Tooltip,
  useLocale,
  useMediaQuery
} from '@gobob/ui';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useRouter } from 'next/navigation';
import { Key, ReactNode, useEffect, useMemo, useState } from 'react';
import { useTheme } from 'styled-components';

import { stakingInfo, StakingInfo } from '../../../utils/stakeData';
import { StrategyData, useGetStakingStrategies } from '../../hooks';
import { StakeRewards } from '../StakeRewards';
import { StrategyModal } from '../StrategyModal';

import { RoutesPath } from '@/constants';

const getSkeletons = () =>
  Array(8)
    .fill(undefined)
    .map((_, idx) => ({
      id: idx,
      [StakeTableColumns.STRATEGY]: (
        <Flex alignItems='center' gap='lg'>
          <Skeleton height='5xl' rounded='full' width='5xl' />
          <Flex alignItems='flex-start' direction='column'>
            <Skeleton height='xl' width='12rem' />
            <Skeleton height='xl' width='8rem' />
          </Flex>
        </Flex>
      ),
      [StakeTableColumns.REWARDS]: <Skeleton height='2xl' width='7xl' />,
      [StakeTableColumns.TVL]: <Skeleton height='2xl' width='7xl' />
    }));

const getCategoryLabel = (type: 'bridge' | 'dex' | 'staking' | 'lending') => {
  switch (type) {
    case 'bridge':
      return <Trans>Bridge</Trans>;
    case 'staking':
      return <Trans>Staking</Trans>;
    case 'dex':
      return 'DEX';
    case 'lending':
      return <Trans>Lending</Trans>;
  }
};

const StrategyCell = ({ logo, name, protocol }: { logo: string; protocol: string; name: string }) => (
  <Flex alignItems='center' gap='lg'>
    <Avatar size='5xl' src={logo} />
    <Flex alignItems='flex-start' direction='column'>
      <Span size='s' weight='bold'>
        {name}
      </Span>
      <Span color='grey-50' size='s' weight='medium'>
        {protocol}
      </Span>
    </Flex>
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
};

const columns = [
  { name: <Trans>Strategy</Trans>, id: StakeTableColumns.STRATEGY, width: '40%' as `${number}%` },
  { name: <Trans>Rewards</Trans>, id: StakeTableColumns.REWARDS, width: '40%' as `${number}%` },
  {
    name: (
      <Flex alignItems='center' gap='s' justifyContent='flex-end'>
        <Trans>TVL</Trans>
        <Tooltip color='primary' label={<Trans>TVL on BOB</Trans>}>
          <InformationCircle color='grey-50' size='xs' />
        </Tooltip>
      </Flex>
    ),
    id: StakeTableColumns.TVL
  }
];

const stakingInfoAny = stakingInfo as StakingInfo;

enum StakeTableFilter {
  AllStrategies = 'all-strategies',
  YourStrategies = 'your-strategies'
}

interface Props {
  searchParams?: { receive: string };
  onStakeSuccess: () => void;
}

const AllCategory = 'all-categories';

const StakeTable = ({ searchParams, onStakeSuccess }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('s'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const router = useRouter();

  const { locale } = useLocale();

  const { i18n } = useLingui();

  const urlSearchParams = useMemo(() => new URLSearchParams(searchParams), [searchParams]);

  const [filter, setFilter] = useState(StakeTableFilter.AllStrategies);
  const [category, setCategory] = useState(AllCategory);
  const [strategy, setStrategy] = useState<StrategyData>();

  const { data: strategies = [], isPending: isStrategiesPending } = useGetStakingStrategies();

  const categories = useMemo(() => {
    return Array.from(new Set(strategies.map((s) => s.raw.integration.type)));
  }, [strategies]);

  const filteredStrategies = useMemo(() => {
    const base =
      filter === StakeTableFilter.AllStrategies ? strategies : strategies.filter((s) => Number(s.userStaked) > 0);

    return category === AllCategory ? base : base.filter((s) => s.raw.integration.type === category);
  }, [filter, category, strategies]);

  const sortedStrategies = useMemo(() => {
    return [...filteredStrategies].sort((a, b) => (b?.tvl || 0) - (a?.tvl || 0));
  }, [filteredStrategies]);

  useEffect(() => {
    if (!strategies || !urlSearchParams) return;

    const receive = urlSearchParams.get('receive');
    const strategy = strategies.find((strategy) => strategy.raw.integration.slug === receive);

    if (!strategy) return;

    handleStrategyNavigate(strategy.raw.integration.slug);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearchParams, strategies]);

  const rows: StakeTableRow[] = useMemo(
    () =>
      sortedStrategies.map((strategy) => {
        return {
          id: strategy.raw.integration.slug,
          [StakeTableColumns.STRATEGY]: (
            <StrategyCell
              logo={
                strategy.raw.integration.logo ||
                'https://github.com/0xPellNetwork/pell_media_kit/blob/main/logos/500r_whiteblack.png?raw=true'
              }
              name={stakingInfoAny[strategy?.raw.integration.slug ?? '']?.strategy as string}
              protocol={stakingInfoAny[strategy?.raw.integration.slug ?? '']?.protocol as string}
            />
          ),
          [StakeTableColumns.REWARDS]: <StakeRewards slug={strategy?.raw.integration.slug ?? ''} />,
          [StakeTableColumns.TVL]: strategy?.tvl
            ? Intl.NumberFormat(locale, {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
                notation: 'compact'
              }).format(strategy.tvl)
            : '-'
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sortedStrategies]
  );

  const handleFilterChange = (key: Key) => setFilter(key.toString() as StakeTableFilter);

  const handleStrategyNavigate = (slug: string) => router.push(`${RoutesPath.STAKE}/${slug}`);

  return (
    <Flex direction='column' gap='md'>
      <Flex wrap alignItems='center' gap='md' justifyContent={{ base: 'flex-start', s: 'space-between' }}>
        <Card alignSelf='self-start' padding='xs'>
          {isMobile ? (
            <Select
              modalProps={{ title: <Trans>Select Filter</Trans> }}
              type='modal'
              value={filter}
              onSelectionChange={handleFilterChange}
            >
              <Item key={StakeTableFilter.AllStrategies} textValue={StakeTableFilter.AllStrategies}>
                <Trans>All Strategies</Trans>
              </Item>
              <Item key={StakeTableFilter.YourStrategies} textValue={StakeTableFilter.YourStrategies}>
                <Trans>Your Strategies</Trans>
              </Item>
            </Select>
          ) : (
            <Tabs selectedKey={filter} size='s' variant='solid' onSelectionChange={handleFilterChange}>
              <TabsItem key={StakeTableFilter.AllStrategies} title={<Trans>All Strategies</Trans>}>
                <></>
              </TabsItem>
              <TabsItem key={StakeTableFilter.YourStrategies} title={<Trans>Your Strategies</Trans>}>
                <></>
              </TabsItem>
            </Tabs>
          )}
        </Card>
        <Card alignSelf='self-start' padding='xs'>
          <Select
            modalProps={{ title: <Trans>Select Category</Trans> }}
            type='modal'
            value={category}
            onSelectionChange={(key) => setCategory(key.toString())}
          >
            <Item key={AllCategory} textValue={category}>
              <Trans>All Categories</Trans>
            </Item>
            {
              [...Array.from(categories)].map((category) => (
                <Item key={category} textValue={category}>
                  {getCategoryLabel(category)}
                </Item>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              )) as unknown as any
            }
          </Select>
        </Card>
      </Flex>
      {isTablet ? (
        <List
          gap='md'
          selectionMode='single'
          onSelectionChange={(keys) => {
            const [slug] = keys;

            if (!slug) return;

            handleStrategyNavigate(slug as string);
          }}
        >
          {(isStrategiesPending ? getSkeletons() : rows).map((row) => (
            <ListItem key={row.id} backgroundColor='grey-400'>
              <Flex direction='column' flex={1} gap='2xl' padding='xl'>
                {row[StakeTableColumns.STRATEGY]}
                <Dl direction='column' flex={1} gap='s' justifyContent='space-between'>
                  <DlGroup justifyContent='space-between'>
                    <Dt size='s'>{columns.find((column) => column.id === StakeTableColumns.TVL)?.name}</Dt>
                    <Dd>{row[StakeTableColumns.TVL]}</Dd>
                  </DlGroup>
                  <DlGroup justifyContent='space-between'>
                    <Dt size='s'>{columns.find((column) => column.id === StakeTableColumns.REWARDS)?.name}</Dt>
                    <Dd>{row[StakeTableColumns.REWARDS]}</Dd>
                  </DlGroup>
                </Dl>
              </Flex>
            </ListItem>
          ))}
        </List>
      ) : (
        <Table
          aria-label={t(i18n)`Staking table`}
          columns={columns}
          rows={isStrategiesPending ? getSkeletons() : rows}
          onRowAction={(id) => router.push(`${RoutesPath.STAKE}/${id}`)}
        />
      )}
      {strategy && (
        <StrategyModal
          stakingInfo={stakingInfoAny[strategy?.raw.integration.slug]}
          strategy={strategy}
          onCloseModal={() => setStrategy(undefined)}
          onStakeSuccess={onStakeSuccess}
        />
      )}
    </Flex>
  );
};

export { StakeTable };
