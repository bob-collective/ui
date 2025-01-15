import {
  Avatar,
  Card,
  Dd,
  Dl,
  DlGroup,
  Dt,
  Flex,
  InformationCircle,
  List,
  ListItem,
  P,
  Selection,
  Skeleton,
  Span,
  Table,
  Tooltip,
  useCurrencyFormatter,
  useLocale,
  useMediaQuery
} from '@gobob/ui';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useTheme } from 'styled-components';

import { useGetStrategies } from '../../hooks';
import { StrategyRewards } from '../StrategyRewards';

import { StrategiesFilter, StrategiesFilterOption } from './StrategiesFilter';
import { StrategiesCategories } from './StrategiesCategories';

import { AmountLabel } from '@/components';
import { RoutesPath } from '@/constants';
import { useUserAgent } from '@/user-agent';

const getSkeletons = () =>
  Array(8)
    .fill(undefined)
    .map((_, idx) => ({
      id: idx,
      [StrategiesTableColumns.STRATEGY]: (
        <Flex alignItems='center' gap='lg'>
          <Skeleton height='5xl' rounded='full' width='5xl' />
          <Flex alignItems='flex-start' direction='column'>
            <Skeleton height='xl' width='12rem' />
            <Skeleton height='xl' width='8rem' />
          </Flex>
        </Flex>
      ),
      [StrategiesTableColumns.REWARDS]: <Skeleton height='2xl' rounded='full' width='7xl' />,
      [StrategiesTableColumns.AMOUNT]: <Skeleton height='2xl' width='7xl' />,
      [StrategiesTableColumns.TVL]: <Skeleton height='2xl' width='7xl' />
    }));

const StrategyCell = ({ logo, name, protocol }: { logo: string; protocol: string; name: string }) => (
  <Flex alignItems='center' gap='lg'>
    <Avatar size='5xl' src={logo} />
    <Flex alignItems='flex-start' direction='column'>
      <Span rows={1} size='s' style={{ whiteSpace: 'normal' }} weight='bold'>
        {name}
      </Span>
      <Span color='grey-50' size='s' weight='medium'>
        {protocol}
      </Span>
    </Flex>
  </Flex>
);

enum StrategiesTableColumns {
  STRATEGY = 'strategy',
  REWARDS = 'incentives',
  AMOUNT = 'amount',
  TVL = 'tvl'
}

type StrategiesTableRow = {
  id: string;
  [StrategiesTableColumns.STRATEGY]: ReactNode;
  [StrategiesTableColumns.REWARDS]: ReactNode;
  [StrategiesTableColumns.AMOUNT]: ReactNode;
  [StrategiesTableColumns.TVL]: ReactNode;
};

const StrategyColumn = {
  name: <Trans>Strategy</Trans>,
  id: StrategiesTableColumns.STRATEGY,
  width: '40%' as `${number}%`
};

const TvlColumn = (hideTooltip: boolean) => ({
  name: (
    <Flex alignItems='center' gap='s' justifyContent='flex-end'>
      <Trans>TVL</Trans>
      {!hideTooltip && (
        <Tooltip color='primary' label={<Trans>TVL on BOB</Trans>}>
          <InformationCircle color='grey-50' size='xs' />
        </Tooltip>
      )}
    </Flex>
  ),
  id: StrategiesTableColumns.TVL
});

const RewardsColumn = {
  name: <Trans>Rewards</Trans>,
  id: StrategiesTableColumns.REWARDS,
  width: '40%' as `${number}%`
};

const cardColumnOrder = [StrategiesTableColumns.AMOUNT, StrategiesTableColumns.TVL, StrategiesTableColumns.REWARDS];

type StrategiesTableProps = {
  searchParams?: { receive: string };
};

const StrategiesTable = ({ searchParams }: StrategiesTableProps) => {
  const theme = useTheme();
  const isMobileViewport = useMediaQuery(theme.breakpoints.down('md'));
  const { isMobile: isMobileUserAgent } = useUserAgent();

  const isMobile = isMobileViewport || isMobileUserAgent;

  const router = useRouter();

  const { locale } = useLocale();
  const { i18n } = useLingui();

  const urlSearchParams = useMemo(() => new URLSearchParams(searchParams), [searchParams]);

  const [filter, setFilter] = useState<StrategiesFilterOption>(StrategiesFilterOption.AllStrategies);
  const [category, setCategory] = useState<string>();

  const format = useCurrencyFormatter();

  const { data: strategies = [], isPending: isStrategiesPending } = useGetStrategies();

  const categories = useMemo(() => {
    return Array.from(new Set(strategies.map((strategy) => strategy.meta.type)));
  }, [strategies]);

  const filteredStrategies = useMemo(() => {
    const base =
      filter === StrategiesFilterOption.AllStrategies
        ? strategies
        : strategies.filter((strategy) => !!strategy.deposit);

    return category ? base.filter((strategy) => strategy.meta.type === category) : base;
  }, [filter, category, strategies]);

  const sortedStrategies = useMemo(() => {
    return [...filteredStrategies].sort((a, b) => (b?.tvl || 0) - (a?.tvl || 0));
  }, [filteredStrategies]);

  useEffect(() => {
    if (!strategies || !urlSearchParams) return;

    const receive = urlSearchParams.get('receive');
    const strategy = strategies.find((strategy) => strategy.meta.slug === receive);

    if (!strategy) return;

    handleStrategyNavigate(strategy.meta.slug);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearchParams, strategies]);

  const rows: StrategiesTableRow[] = useMemo(
    () =>
      sortedStrategies.map((strategy) => {
        return {
          id: strategy.meta.slug,
          [StrategiesTableColumns.STRATEGY]: (
            <StrategyCell
              logo={strategy.meta.logo || strategy.info.logoUrl || ''}
              name={strategy.info.name}
              protocol={strategy.info.protocol}
            />
          ),
          [StrategiesTableColumns.AMOUNT]: (
            <Flex direction='column'>
              <AmountLabel hidePrice amount={strategy.deposit?.amount} />
              {strategy.deposit?.usd && (
                <P color='grey-50' size='s'>
                  {format(strategy.deposit.usd)}
                </P>
              )}
            </Flex>
          ),
          [StrategiesTableColumns.REWARDS]: <StrategyRewards incentives={strategy.info.incentives} />,
          [StrategiesTableColumns.TVL]: strategy?.tvl
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

  const handleFilterChange = (key: StrategiesFilterOption) => setFilter(key);

  const handleCategoryChange = (key?: string) => setCategory(key);

  const handleStrategyNavigate = (slug: string) => router.push(`${RoutesPath.STRATEGIES}/${slug}`);

  const handleListSelectionChange = (keys: Selection) => {
    if (isStrategiesPending) return;

    const [slug] = keys;

    if (!slug) return;

    handleStrategyNavigate(slug as string);
  };

  const columns = useMemo(
    () =>
      filter === StrategiesFilterOption.MyDeposits
        ? [
            { ...StrategyColumn },
            { ...RewardsColumn, width: '30%' as `${number}%` },
            { name: <Trans>Amount</Trans>, id: StrategiesTableColumns.AMOUNT, width: '20%' as `${number}%` },
            TvlColumn(isMobile)
          ]
        : [StrategyColumn, RewardsColumn, TvlColumn(isMobile)],
    [filter, isMobile]
  );

  const mobileColumns = useMemo(
    () =>
      isMobile
        ? columns
            .filter((column) => column.id !== StrategiesTableColumns.STRATEGY)
            .sort(
              (a, b) =>
                cardColumnOrder.indexOf(a.id as StrategiesTableColumns) -
                cardColumnOrder.indexOf(b.id as StrategiesTableColumns)
            )
        : [],
    [columns, isMobile]
  );

  return (
    <Flex direction='column' gap='md'>
      <Flex wrap alignItems='center' gap='md' justifyContent={{ base: 'flex-start', s: 'space-between' }}>
        <StrategiesFilter value={filter} onSelectionChange={handleFilterChange} />
        <StrategiesCategories categories={categories} value={category} onSelectionChange={handleCategoryChange} />
      </Flex>
      {isMobile ? (
        <List
          aria-label={t(i18n)`Staking list`}
          gap='md'
          selectionMode='single'
          onSelectionChange={handleListSelectionChange}
        >
          {(isStrategiesPending ? getSkeletons() : rows).map((row) => (
            <ListItem key={row.id} backgroundColor='grey-400' padding='md'>
              <Flex
                direction='column'
                flex={1}
                gap='2xl'
                style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {row[StrategiesTableColumns.STRATEGY]}
                <Dl direction='column' flex={1} gap='s' justifyContent='space-between'>
                  {mobileColumns.map((column) => (
                    <DlGroup
                      key={column.id}
                      alignItems='flex-start'
                      direction={column.id === StrategiesTableColumns.REWARDS ? 'column' : 'row'}
                      justifyContent='space-between'
                    >
                      <Dt size='s'>{column.name}</Dt>
                      <Dd size='s'>{row[column.id]}</Dd>
                    </DlGroup>
                  ))}
                </Dl>
              </Flex>
            </ListItem>
          ))}
        </List>
      ) : (
        <Card style={{ overflow: 'auto' }}>
          <Table
            removeWrapper
            aria-label={t(i18n)`Staking table`}
            columns={columns}
            rows={isStrategiesPending ? getSkeletons() : rows}
            onRowAction={isStrategiesPending ? undefined : (id) => router.push(`${RoutesPath.STRATEGIES}/${id}`)}
          />
          {!isStrategiesPending && rows.length === 0 && (
            <Flex alignItems='center' direction='column' gap='md' justifyContent='center' marginY='10xl'>
              <P align='center'>
                <Trans>No strategies to display</Trans>
              </P>
            </Flex>
          )}
        </Card>
      )}
    </Flex>
  );
};

export { StrategiesTable };
