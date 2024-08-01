import { INTERVAL, useQuery } from '@gobob/react-query';
import { useId, useMemo } from 'react';
import { Flex, Spinner } from '@gobob/ui';
import { useAccount } from '@gobob/wagmi';
import { useLocale } from '@gobob/ui';

import { QuestRefCodes, apiClient } from '../../../../utils';
import { useGetUser } from '../../../../hooks';
import { QuestOwnerIcon } from '../QuestOwnerAvatar';

import { Leaderboard, LeaderboardColumns, LeaderboardRow } from './Leaderboard';

const userRankKey = 'userRankKey';

const AllUsersLeaderboard = (): JSX.Element => {
  const { address } = useAccount();
  const id = useId();
  const { locale } = useLocale();

  const { data: user } = useGetUser();

  const { data, isLoading } = useQuery({
    queryKey: ['allUsersLeaderboard'],
    queryFn: async () => {
      const fetchedData = await apiClient.getLeaderboard(100, 0);

      return fetchedData.leaderboard.map((item, idx) => {
        return {
          id: `${item.username}${idx}`,
          [LeaderboardColumns.RANK]: <Flex paddingY='md'>{item.rank}</Flex>,
          [LeaderboardColumns.INVITED_BY]: item.referred_by || '-',
          [LeaderboardColumns.NAME]: item.username,
          [LeaderboardColumns.QUESTS]: item.quests_breakdown && (
            <Flex gap='xxs'>
              {item.quests_breakdown[QuestRefCodes.GALXE] && <QuestOwnerIcon name='galxe' />}
              {item.quests_breakdown[QuestRefCodes.INTRACT] && <QuestOwnerIcon name='intract' />}
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
    <>
      {isLoading ? (
        <Flex justifyContent='center' marginTop='8xl'>
          <Spinner size='36' thickness={5} />
        </Flex>
      ) : (
        <Leaderboard id={id} rows={flatData} />
      )}
    </>
  );
};

export { AllUsersLeaderboard };
