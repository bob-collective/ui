import {
  Avatar,
  Card,
  ChevronRight,
  Dd,
  Dl,
  DlGroup,
  Dt,
  Flex,
  InformationCircle,
  List,
  ListItem,
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
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useTheme } from 'styled-components';

import { stakingInfo, StakingInfo } from '../../../utils/stakeData';
import { StrategyData, useGetStakingStrategies } from '../../hooks';
import { StakeRewards } from '../StakeRewards';
import { StrategyModal } from '../StrategyModal';

import { RoutesPath } from '@/constants';

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
  {
    name: (
      <Flex alignItems='center' gap='s'>
        <Trans>TVL</Trans>
        <Tooltip color='primary' label={<Trans>TVL on BOB</Trans>}>
          <InformationCircle color='grey-50' size='xs' />
        </Tooltip>
      </Flex>
    ),
    id: StakeTableColumns.TVL,
    minWidth: 96
  },
  { name: '', id: StakeTableColumns.ACTIONS }
];

const stakingInfoAny = stakingInfo as StakingInfo;

interface Props {
  searchParams?: { receive: string };
  onStakeSuccess: () => void;
}

const AllCategory = 'all';

const StakeTable = ({ searchParams, onStakeSuccess }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [category, setCategory] = useState(AllCategory);
  const [strategy, setStrategy] = useState<StrategyData>();

  const router = useRouter();

  const { locale } = useLocale();

  const { i18n } = useLingui();

  const urlSearchParams = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const { data: strategies = [] } = useGetStakingStrategies();

  const categories = new Set(strategies.map((strategy) => strategy.raw.integration.type));

  const filteredStrategies =
    category === AllCategory
      ? [...strategies]
      : [...strategies].filter((strategy) => strategy.raw.integration.type === category);

  const sortedStrategies = filteredStrategies.sort((a, b) => (b?.tvl || 0) - (a?.tvl || 0));

  useEffect(() => {
    if (!strategies || !urlSearchParams) return;

    const receive = urlSearchParams.get('receive');
    const validStrategy = strategies.find((strategy) => strategy.raw.integration.slug === receive);

    setStrategy(validStrategy);
  }, [urlSearchParams, strategies]);

  const rows: StakeTableRow[] = useMemo(
    () =>
      sortedStrategies.map((strategy) => {
        return {
          id: strategy.raw.integration.slug,
          [StakeTableColumns.STRATEGY]: (
            <Flex alignItems='center' gap='lg'>
              <Avatar
                size='5xl'
                src={
                  strategy.raw.integration.logo ||
                  'https://github.com/0xPellNetwork/pell_media_kit/blob/main/logos/500r_whiteblack.png?raw=true'
                }
              />
              <StrategyCell
                name={stakingInfoAny[strategy?.raw.integration.slug ?? '']?.strategy as string}
                protocol={stakingInfoAny[strategy?.raw.integration.slug ?? '']?.protocol as string}
              />
            </Flex>
          ),
          // [StakeTableColumns.ACTIONS]: (
          //   <Flex direction='row' gap='md'>
          //     <Button
          //       color='primary'
          //       elementType={Link}
          //       {...{ href: `${RoutesPath.STAKE}/${strategy.raw.integration.slug}` }}
          //     >
          //       <Trans>Stake</Trans>
          //     </Button>
          //     {Number(strategy?.userStaked) > 0 && (
          //       <Button
          //         variant='outline'
          //         onPress={() =>
          //           window.open(stakingInfoAny[strategy?.raw.integration.slug ?? '']?.website, '_blank', 'noreferrer')
          //         }
          //       >
          //         <Trans>Manage</Trans>
          //       </Button>
          //     )}
          //   </Flex>
          // )
          [StakeTableColumns.REWARDS]: <StakeRewards direction='row' slug={strategy?.raw.integration.slug ?? ''} />,
          [StakeTableColumns.TVL]: strategy?.tvl
            ? Intl.NumberFormat(locale, {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
                notation: 'compact'
              }).format(strategy.tvl)
            : '-',
          [StakeTableColumns.ACTIONS]: <ChevronRight color='grey-50' size='s' />
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sortedStrategies]
  );

  return (
    <Flex direction='column'>
      {/* <Flex alignItems='center' gap='md' justifyContent='space-between'>
        <H1 size='2xl'>
          <Trans>Stake Bitcoin</Trans>
        </H1>
        <Select
          modalProps={{ title: <Trans>Select Category</Trans> }}
          style={{ width: '100%', maxWidth: '14rem' }}
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
      </Flex> */}
      <Card alignSelf='self-start' padding='xs'>
        <Tabs size='s' variant='solid'>
          <TabsItem key='all' title={<Trans>All Categories</Trans>}>
            <></>
          </TabsItem>
          <TabsItem key='deposits' title={<Trans>My Deposits</Trans>}>
            <></>
          </TabsItem>
          <TabsItem key='lending' title={<Trans>Lending</Trans>}>
            <></>
          </TabsItem>
          <TabsItem key='staking' title={<Trans>Staking</Trans>}>
            <></>
          </TabsItem>
        </Tabs>
      </Card>
      {isMobile ? (
        <List>
          {rows.map((row) => (
            <ListItem key={row.id} padding='none'>
              <Card direction='column' flex={1} gap='2xl' padding='2xl'>
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
              </Card>
            </ListItem>
          ))}
        </List>
      ) : (
        <Table
          aria-label={t(i18n)`Staking table`}
          columns={columns}
          rows={rows}
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
