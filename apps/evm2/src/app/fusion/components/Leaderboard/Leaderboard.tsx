import { ReactNode } from 'react';

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

type Props = {
  id: string;
  rows: LeaderboardRow[];
};

type LeaderboardProps = Props;

const userRankKey = 'userRankKey';

const Leaderboard = ({ id, rows }: LeaderboardProps): JSX.Element => {
  return (
    <StyledTable
      isStickyHeader
      aria-labelledby={id}
      columns={columns}
      rows={rows}
      selectedKeys={[userRankKey]}
      selectionMode='single'
      wrapperProps={
        {
          marginTop: '4xl'
        } as any
      }
    />
  );
};

export { Leaderboard };
