import { INTERVAL, useQuery } from '@gobob/react-query';
import { ReactNode, useId, useMemo } from 'react';
import { Flex, Spinner } from '@gobob/ui';
import { useAccount } from '@gobob/wagmi';
import { useLocale } from '@gobob/ui';

import { apiClient } from '../../../../utils';
import { useGetUser } from '../../../../hooks';
import { QuestOwnerIcon } from '../QuestOwnerAvatar';

import { StyledTable } from './Leaderboard.style';

enum LeaderboardColumns {
  RANK = 'rank',
  NAME = 'name',
  INVITED_BY = 'invitedBy',
  QUESTS = 'quests',
  SPICE = 'spice'
}

type LeaderboardRow = {
  id: string;
  [LeaderboardColumns.RANK]: ReactNode;
  [LeaderboardColumns.NAME]: ReactNode;
  [LeaderboardColumns.INVITED_BY]: ReactNode;
  [LeaderboardColumns.QUESTS]: ReactNode;
  [LeaderboardColumns.SPICE]: ReactNode;
};

// const fetchSize = 50;

const userRankKey = 'userRankKey';

const Leaderboard = (): JSX.Element => {
  const { address } = useAccount();
  const id = useId();
  const { locale } = useLocale();

  const { data: user } = useGetUser();

  const columns = [
    { name: 'Rank', id: LeaderboardColumns.RANK },
    { name: 'Name', id: LeaderboardColumns.NAME },
    { name: 'Invited By', id: LeaderboardColumns.INVITED_BY },
    { name: 'Quests', id: LeaderboardColumns.QUESTS },
    { name: 'Spice', id: LeaderboardColumns.SPICE }
  ];

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const fetchedData = await apiClient.getLeaderboard(100, 0);

      return fetchedData.leaderboard.map((item, idx) => {
        return {
          id: `${item.deposit_owner}${idx}`,
          [LeaderboardColumns.RANK]: <Flex paddingY='md'>{item.rank}</Flex>,
          [LeaderboardColumns.INVITED_BY]: item.referred_by || '-',
          [LeaderboardColumns.NAME]: item.username,
          [LeaderboardColumns.QUESTS]: item.quests_breakdown && (
            <Flex gap='xxs'>
              {item.quests_breakdown['itxc9y'] && <QuestOwnerIcon name='galxe' />}
              {/* <QuestOwnerIcon name='intract' /> */}
            </Flex>
          ),
          [LeaderboardColumns.SPICE]: Intl.NumberFormat(locale).format(Number(item.total_points))
        };
      });
    },
    refetchOnWindowFocus: false,
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
              spice: Intl.NumberFormat().format(user.leaderboardRank?.total_reward_points || 0),
              quests: user.quests_breakdown && (
                <Flex gap='xxs'>
                  {user.quests_breakdown['itxc9y'] && <QuestOwnerIcon name='galxe' />}
                  {/* <QuestOwnerIcon name='intract' /> */}
                </Flex>
              ),
              rank: <Flex paddingY='md'>{user.leaderboardRank?.rank || '-'}</Flex>
            }
          ]
        : [];

    return [...userData, ...(data || [])];
  }, [data, address, user]);

  return (
    <>
      {isLoading ? (
        <Flex justifyContent='center' marginTop='8xl'>
          <Spinner size='36' thickness={5} />
        </Flex>
      ) : (
        <StyledTable
          isStickyHeader
          aria-labelledby={id}
          columns={columns}
          rows={flatData || []}
          selectedKeys={[userRankKey]}
          selectionMode='single'
          wrapperProps={
            {
              marginTop: '4xl'
            } as any
          }
        />
      )}
    </>
  );
};

export { Leaderboard };
