import { INTERVAL, useQuery } from '@gobob/react-query';
import { ReactNode, useId, useMemo, useRef } from 'react';
import { Flex, Spinner } from '@gobob/ui';
import { useAccount } from '@gobob/wagmi';
import { useLocale } from '@gobob/ui';

import { apiClient } from '../../../../utils';
import { useGetUser } from '../../../../hooks';

import { StyledTable } from './Leaderboard.style';

enum LeaderboardColumns {
  RANK = 'rank',
  NAME = 'name',
  INVITED_BY = 'invitedBy',
  SPICE = 'spice'
}

type LeaderboardRow = {
  id: string;
  [LeaderboardColumns.RANK]: ReactNode;
  [LeaderboardColumns.NAME]: ReactNode;
  [LeaderboardColumns.INVITED_BY]: ReactNode;
  [LeaderboardColumns.SPICE]: ReactNode;
};

// const fetchSize = 50;

const userRankKey = 'userRankKey';

const Leaderboard = (): JSX.Element => {
  const { address } = useAccount();
  const tableContainerRef = useRef(null);
  const id = useId();
  const { locale } = useLocale();

  const { data: user } = useGetUser();

  const columns = [
    { name: 'Rank', id: LeaderboardColumns.RANK },
    { name: 'Name', id: LeaderboardColumns.NAME },
    { name: 'Invited By', id: LeaderboardColumns.INVITED_BY },
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
          [LeaderboardColumns.SPICE]: Intl.NumberFormat(locale).format(Number(item.total_points))
        };
      });
    },
    refetchOnWindowFocus: false,
    refetchInterval: INTERVAL.MINUTE
  });

  // const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery({
  //   queryKey: ['leaderboard'],
  //   queryFn: async ({ pageParam = 0 }) => {
  //     const start = (pageParam as number) * fetchSize;
  //     const fetchedData = await apiClient.getLeaderboard(4, start);

  //     const rows = fetchedData.leaderboard.map((item, idx) => {
  //       return {
  //         id: `${item.deposit_owner}${idx}`,
  //         [LeaderboardColumns.RANK]: <Flex paddingY='md'>{item.rank}</Flex>,
  //         [LeaderboardColumns.INVITED_BY]: item.referred_by || '-',
  //         [LeaderboardColumns.NAME]: item.username,
  //         [LeaderboardColumns.POINTS]: Intl.NumberFormat(locale).format(Number(item.total_points))
  //       };
  //     });

  //     return { data: rows, total: fetchedData.total };
  //   },
  //   getNextPageParam: (_lastGroup, groups) => groups.length,
  //   refetchOnWindowFocus: false
  // });

  const flatData: LeaderboardRow[] = useMemo(() => {
    const userData =
      address && user
        ? [
            {
              id: userRankKey,
              invitedBy: user.referred_by,
              name: user.username,
              spice: Intl.NumberFormat().format(user.leaderboardRank?.total_reward_points || 0),
              rank: <Flex paddingY='md'>{user.leaderboardRank?.rank || '-'}</Flex>
            }
          ]
        : [];

    return [...userData, ...(data || [])];
  }, [data, address, user]);

  // const totalFetched = flatData.length;

  // const fetchMoreOnBottomReached = useCallback(
  //   (containerRefElement?: HTMLDivElement | null) => {
  //     if (containerRefElement) {
  //       const { scrollHeight, scrollTop, clientHeight } = containerRefElement;

  //       //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
  //       if (
  //         scrollHeight - scrollTop - clientHeight < 500 &&
  //         !isFetching &&
  //         totalFetched < (data?.pages[0].total || 0)
  //       ) {
  //         fetchNextPage();
  //       }
  //     }
  //   },
  //   [fetchNextPage, isFetching, totalFetched]
  // );

  // //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  // useEffect(() => {
  //   fetchMoreOnBottomReached(tableContainerRef.current);
  // }, [fetchMoreOnBottomReached]);

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
              ref: tableContainerRef as any,
              // onScroll: (e: any) => fetchMoreOnBottomReached(e.target as HTMLDivElement),
              marginTop: '4xl'
            } as any
          }
        />
      )}
    </>
  );
};

export { Leaderboard };
