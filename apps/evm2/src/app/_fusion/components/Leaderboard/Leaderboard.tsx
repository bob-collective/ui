import { INTERVAL, useQuery } from '@gobob/react-query';
import { Chip, Flex, H2, Skeleton, Span, Table, Tabs, TabsItem, useLocale } from '@gobob/ui';
import { useAccount } from '@gobob/wagmi';
import { useCallback, useId, useState } from 'react';
import { ReactNode } from 'react';

import { QuestOwnerIcon } from '../QuestOwnerAvatar';
import { Medal } from '../../../_apps/components/Medal';

import { StyledQuestList, StyledSkeletonWrapper } from './Leaderboard.style';

import { useGetUser } from '@/hooks';
import { QuestRefCodes, apiClient } from '@/utils';
import { fusionKeys } from '@/lib/react-query';
import { SpiceAmount } from '@/components';

const SpiceColumn = ({ amount }: { amount: number }) => <SpiceAmount amount={amount} />;

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

const QuestsColumn = ({
  hasGalxe,
  hasIntract,
  earnedSpice,
  locale
}: {
  locale: Intl.LocalesArgument;
  hasGalxe: boolean;
  hasIntract: boolean;
  earnedSpice?: number;
}) => (
  <Flex alignItems='center' gap='s' justifyContent='flex-end'>
    <StyledQuestList>
      {hasGalxe && <QuestOwnerIcon name='galxe' />}
      {hasIntract && <QuestOwnerIcon name='intract' />}
    </StyledQuestList>
    {!!earnedSpice && (
      <Span size='inherit'>+{Intl.NumberFormat(locale, { notation: 'compact' }).format(Number(earnedSpice))}</Span>
    )}
  </Flex>
);

enum LeaderboardTabs {
  SEASON = 's3_leaderboard',
  HOURS_24 = 's3_one_day_change',
  DAYS_7 = 's3_seven_day_change',
  QUESTS_ONLY = 's3_quest_leaderboard'
}

enum LeaderboardColumns {
  NAME = 'name',
  INVITED_BY = 'invitedBy',
  QUESTS = 'quests',
  SPICE = 'spice'
}

type LeaderboardRow = {
  id: string;
  [LeaderboardColumns.NAME]: ReactNode;
  [LeaderboardColumns.INVITED_BY]: ReactNode;
  [LeaderboardColumns.SPICE]: ReactNode;
  [LeaderboardColumns.QUESTS]: ReactNode;
};

const columns = [
  { name: 'Name', id: LeaderboardColumns.NAME },
  { name: 'Invited By', id: LeaderboardColumns.INVITED_BY },
  { name: 'Spice', id: LeaderboardColumns.SPICE },
  { name: 'Quests', id: LeaderboardColumns.QUESTS }
];

const userRankKey = 'userRankKey';

const Leaderboard = (): JSX.Element => {
  const id = useId();
  const { locale } = useLocale();

  const { address } = useAccount();
  const { data: user } = useGetUser();

  const [tab, setTab] = useState(LeaderboardTabs.SEASON);

  const isAuthenticated = address && user;

  const getUserData = useCallback(() => {
    if (!isAuthenticated) return;

    switch (tab) {
      case LeaderboardTabs.SEASON: {
        const [data] = user.season3Data.s3LeaderboardData;

        return {
          rank: data.group_rank,
          questPoints: data.quest_points,
          points: data.total_points
        };
      }
      case LeaderboardTabs.HOURS_24: {
        const [data] = user.season3Data.oneDayLeaderboardEntry;

        return {
          rank: data.group_rank,
          questPoints: data.quest_points,
          points: data.total_points
        };
      }
      case LeaderboardTabs.DAYS_7: {
        const [data] = user.season3Data.sevenDayLeaderboardEntry;

        return {
          rank: data.group_rank,
          questPoints: data.quest_points,
          points: data.total_points
        };
      }
      // TODO: im not 100% sure here
      case LeaderboardTabs.QUESTS_ONLY: {
        const [data] = user.season3Data.s3LeaderboardData;

        return {
          rank: data.quest_rank,
          questPoints: data.quest_points,
          points: data.quest_points
        };
      }
    }
  }, [isAuthenticated, tab, user]);

  const { data, isLoading } = useQuery({
    queryKey: fusionKeys.leaderboard(),
    queryFn: async () => apiClient.getLeaderboardSeason3(10, 0),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: INTERVAL.HOUR,
    select: (data): LeaderboardRow[] => {
      const isQuestLeaderboard = tab === LeaderboardTabs.QUESTS_ONLY;

      const leaderboard = data.leaderboardData[tab].map((item, idx) => {
        const questPoints =
          (item.quests_breakdown?.[QuestRefCodes.GALXE] || 0) + (item.quests_breakdown?.[QuestRefCodes.INTRACT] || 0);

        return {
          id: `${item.username}${idx}`,
          [LeaderboardColumns.INVITED_BY]: item?.referred_by || '-',
          [LeaderboardColumns.NAME]: (
            <NameColumn
              name={item.username}
              rank={isQuestLeaderboard ? Number(item.quest_rank) : Number(item.group_rank)}
            />
          ),
          [LeaderboardColumns.QUESTS]: (
            <QuestsColumn
              earnedSpice={questPoints}
              hasGalxe={!!item.quests_breakdown?.[QuestRefCodes.GALXE]}
              hasIntract={!!item.quests_breakdown?.[QuestRefCodes.INTRACT]}
              locale={locale}
            />
          ),
          [LeaderboardColumns.SPICE]: (
            <SpiceColumn amount={isQuestLeaderboard ? Number(item.quest_points) : Number(item.total_points)} />
          )
        };
      });

      let userData: LeaderboardRow | undefined;

      if (isAuthenticated && !user?.partner) {
        const userLeaderboardData = getUserData();

        if (userLeaderboardData) {
          userData = {
            id: userRankKey,
            invitedBy: user.referred_by,
            name: <NameColumn name={user.username} rank={Number(userLeaderboardData.rank)} />,
            spice: <SpiceColumn amount={Number(userLeaderboardData.points)} />,
            quests: user.quests_breakdown && (
              <QuestsColumn
                earnedSpice={Number(user.total_quest_points)}
                hasGalxe={!!user.quests_breakdown?.[QuestRefCodes.GALXE]}
                hasIntract={!!user.quests_breakdown?.[QuestRefCodes.INTRACT]}
                locale={locale}
              />
            )
          };
        }
      }

      return userData ? [userData, ...leaderboard] : leaderboard;
    }
  });

  const skeletonData = Array(isAuthenticated ? 11 : 10)
    .fill(undefined)
    .map((_, idx) => ({
      id: idx,
      name: (
        <StyledSkeletonWrapper>
          <Skeleton height='2xl' width='10xl' />
        </StyledSkeletonWrapper>
      ),
      invitedBy: <Skeleton height='2xl' width='8xl' />,
      spice: <Skeleton height='2xl' width='7xl' />,
      quests: <Skeleton height='2xl' width='6xl' />
    }));

  return (
    <Flex direction='column' gap='2xl' marginTop='8xl'>
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
      {data && !isLoading ? (
        <Table
          isStickyHeader
          aria-labelledby={id}
          columns={columns}
          rows={data}
          selectedKeys={[userRankKey]}
          selectionMode='single'
        />
      ) : (
        <Flex direction='column'>
          <Table
            isStickyHeader
            aria-labelledby={id}
            columns={columns}
            rows={skeletonData}
            selectedKeys={[userRankKey]}
            selectionMode='single'
          />
        </Flex>
      )}
    </Flex>
  );
};

export { Leaderboard };
