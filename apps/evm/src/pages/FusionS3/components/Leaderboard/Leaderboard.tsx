import { INTERVAL, useQuery } from '@gobob/react-query';
import { Chip, Flex, H2, Span, Tabs, TabsItem, useLocale } from '@gobob/ui';
import { useAccount } from '@gobob/wagmi';
import { useId, useMemo, useState } from 'react';
import { ReactNode } from 'react';
import { Spice } from '@gobob/icons';

import { useGetUser } from '../../../../hooks';
import { QuestRefCodes, apiClient } from '../../../../utils';
import { QuestOwnerIcon } from '../QuestOwnerAvatar';
import { fusionKeys } from '../../../../lib/react-query';
import { Medal } from '../../../Apps/components/Medal';

import { StyledTable } from './Leaderboard.style';

const SpiceColumn = ({ locale, amount }: { locale: any; amount: number }) => (
  <Flex alignItems='center' gap='s' justifyContent='flex-end'>
    <Spice />
    <Span size='inherit'>{Intl.NumberFormat(locale).format(Number(amount))}</Span>
  </Flex>
);

const NameColumn = ({ rank, name }: { rank: number; name: string }) => (
  <Flex alignItems='center' gap='s'>
    {rank > 10 ? (
      <Chip background='grey-400' borderColor='grey-300' rounded='s'>
        <Span size='md' weight='bold'>
          {rank}
        </Span>
      </Chip>
    ) : (
      <Medal position={rank} size='xl' />
    )}
    <Span size='inherit'>{name}</Span>
  </Flex>
);

const QuestsColumn = ({ hasGalxe, hasIntract }: { hasGalxe: boolean; hasIntract: boolean }) => (
  <Flex>
    {hasGalxe && <QuestOwnerIcon name='galxe' />}
    {hasIntract && <QuestOwnerIcon name='intract' />}
  </Flex>
);

enum LeaderboardTabs {
  SEASON,
  HOURS_24,
  DAYS_7,
  QUESTS_ONLY
}

export enum LeaderboardColumns {
  NAME = 'name',
  INVITED_BY = 'invitedBy',
  QUESTS = 'quests',
  SPICE = 'spice'
}

export type LeaderboardRow = {
  id: string;
  [LeaderboardColumns.NAME]: ReactNode;
  [LeaderboardColumns.INVITED_BY]: ReactNode;
  [LeaderboardColumns.QUESTS]: ReactNode;
  [LeaderboardColumns.SPICE]: ReactNode;
};

const columns = [
  { name: 'Name', id: LeaderboardColumns.NAME },
  { name: 'Invited By', id: LeaderboardColumns.INVITED_BY },
  { name: 'Quests', id: LeaderboardColumns.QUESTS },
  { name: 'Spice', id: LeaderboardColumns.SPICE }
];

const userRankKey = 'userRankKey';

const Leaderboard = (): JSX.Element => {
  const id = useId();
  const { locale } = useLocale();

  const { address } = useAccount();
  const { data: user } = useGetUser();

  const [tab, setTab] = useState(LeaderboardTabs.SEASON);

  const { data } = useQuery({
    queryKey: fusionKeys.leaderboard(),
    queryFn: async () => apiClient.getQuestLeaderboard(10, 0),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: INTERVAL.MINUTE,
    select: (data) => {
      return data.leaderboard.map((item, idx) => {
        return {
          id: `${item.username}${idx}`,
          // [LeaderboardColumns.RANK]: <Flex paddingY='md'>{item.rank}</Flex>,
          [LeaderboardColumns.INVITED_BY]: item.referred_by || '-',
          [LeaderboardColumns.NAME]: <NameColumn name={item.username} rank={Number(item.rank)} />,
          [LeaderboardColumns.QUESTS]: (
            <QuestsColumn
              hasGalxe={!!item.points_breakdown?.[QuestRefCodes.GALXE]}
              hasIntract={!!item.points_breakdown?.[QuestRefCodes.INTRACT]}
            />
          ),
          [LeaderboardColumns.SPICE]: <SpiceColumn amount={Number(item.total_points)} locale={locale} />
        };
      });
    }
  });

  const flatData: LeaderboardRow[] = useMemo(() => {
    const userData =
      address && user
        ? [
            {
              id: userRankKey,
              invitedBy: user.referred_by,
              name: <NameColumn name={user.username} rank={user.leaderboardRank.rank} />,
              spice: <SpiceColumn amount={user.leaderboardRank?.total_points || 0} locale={locale} />,
              quests: user.quests_breakdown && (
                <QuestsColumn
                  hasGalxe={!!user.quests_breakdown?.[QuestRefCodes.GALXE]}
                  hasIntract={!!user.quests_breakdown?.[QuestRefCodes.INTRACT]}
                />
              ),
              rank: <Flex paddingY='md'>{user.leaderboardRank?.rank || '-'}</Flex>
            }
          ]
        : [];

    return [...userData, ...(data || [])];
  }, [address, user, locale, data]);

  return (
    <Flex direction='column' gap='2xl' marginTop='3xl'>
      <H2 size='3xl'>Leaderboard</H2>
      <Tabs selectedKey={tab} onSelectionChange={(key) => setTab(key as LeaderboardTabs)}>
        <TabsItem key={LeaderboardTabs.SEASON} title='Season Three'>
          <></>
        </TabsItem>
        <TabsItem key={LeaderboardTabs.HOURS_24} title='Last 24 Hours'>
          <></>
        </TabsItem>
        <TabsItem key={LeaderboardTabs.DAYS_7} title='Last 7 Days'>
          <></>
        </TabsItem>
        <TabsItem key={LeaderboardTabs.QUESTS_ONLY} title='Quests Only'>
          <></>
        </TabsItem>
      </Tabs>
      <StyledTable
        isStickyHeader
        aria-labelledby={id}
        columns={columns}
        rows={flatData}
        selectedKeys={[userRankKey]}
        selectionMode='single'
      />
    </Flex>
  );
};

export { Leaderboard };
