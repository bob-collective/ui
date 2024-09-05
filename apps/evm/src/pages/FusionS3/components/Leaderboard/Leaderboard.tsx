import { INTERVAL, useQuery } from '@gobob/react-query';
import { Flex, H2, useLocale } from '@gobob/ui';
import { useAccount } from '@gobob/wagmi';
import { useId, useMemo } from 'react';
import { ReactNode } from 'react';

import { useGetUser } from '../../../../hooks';
import { QuestRefCodes, apiClient } from '../../../../utils';
import { QuestOwnerIcon } from '../QuestOwnerAvatar';
import { fusionKeys } from '../../../../lib/react-query';

import { StyledGrid } from './Leaderboard.style';
import { StyledTable } from './Leaderboard.style';

export enum LeaderboardColumns {
  RANK = 'rank',
  NAME = 'name',
  INVITED_BY = 'invitedBy',
  QUESTS = 'quests',
  SPICE = 'spice'
}

export type LeaderboardRow = {
  id: string;
  [LeaderboardColumns.RANK]: ReactNode;
  [LeaderboardColumns.NAME]: ReactNode;
  [LeaderboardColumns.INVITED_BY]: ReactNode;
  [LeaderboardColumns.QUESTS]: ReactNode;
  [LeaderboardColumns.SPICE]: ReactNode;
};

const columns = [
  { name: 'Rank', id: LeaderboardColumns.RANK },
  { name: 'Name', id: LeaderboardColumns.NAME },
  { name: 'Invited By', id: LeaderboardColumns.INVITED_BY },
  { name: 'Quests', id: LeaderboardColumns.QUESTS },
  { name: 'Spice', id: LeaderboardColumns.SPICE }
];

const userRankKey = 'userRankKey';

const Leaderboard = (): JSX.Element => {
  const { address } = useAccount();
  const id = useId();
  const { locale } = useLocale();

  const { data: user } = useGetUser();

  const { data } = useQuery({
    queryKey: fusionKeys.leaderboard(),
    queryFn: async () => {
      const fetchedData = await apiClient.getQuestLeaderboard(10, 0);

      return fetchedData.leaderboard.map((item, idx) => {
        return {
          id: `${item.username}${idx}`,
          [LeaderboardColumns.RANK]: <Flex paddingY='md'>{item.rank}</Flex>,
          [LeaderboardColumns.INVITED_BY]: item.referred_by || '-',
          [LeaderboardColumns.NAME]: item.username,
          [LeaderboardColumns.QUESTS]: item.points_breakdown && (
            <StyledGrid>
              {item.points_breakdown[QuestRefCodes.GALXE] && (
                <QuestOwnerIcon name='galxe' style={{ gridColumn: '1' }} />
              )}
              {item.points_breakdown[QuestRefCodes.INTRACT] && (
                <QuestOwnerIcon name='intract' style={{ gridColumn: '2' }} />
              )}
            </StyledGrid>
          ),
          [LeaderboardColumns.SPICE]: Intl.NumberFormat(locale).format(Number(item.total_points))
        };
      });
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: INTERVAL.MINUTE
  });

  const flatData: LeaderboardRow[] = useMemo(() => {
    const userData =
      address && user
        ? [
            {
              id: userRankKey,
              invitedBy: user.referred_by,
              name: user.username,
              spice: Intl.NumberFormat().format(user.leaderboardRank?.total_quest_points || 0),
              quests: user.quests_breakdown && (
                <Flex gap='xxs'>
                  {user.quests_breakdown[QuestRefCodes.GALXE] && <QuestOwnerIcon name='galxe' />}
                  {user.quests_breakdown[QuestRefCodes.INTRACT] && <QuestOwnerIcon name='intract' />}
                </Flex>
              ),
              rank: <Flex paddingY='md'>{user.leaderboardRank?.rank || '-'}</Flex>
            }
          ]
        : [];

    return [...userData, ...(data || [])];
  }, [data, address, user]);

  return (
    <Flex direction='column'>
      <H2>Leaderboard</H2>
      <StyledTable
        isStickyHeader
        aria-labelledby={id}
        columns={columns}
        rows={flatData}
        selectedKeys={[userRankKey]}
        selectionMode='single'
        wrapperProps={
          {
            marginTop: '4xl'
          } as any
        }
      />
    </Flex>
  );
};

export { Leaderboard };
