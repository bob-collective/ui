import { Avatar, Divider, Flex, P } from '@gobob/ui';
import { Fragment } from 'react/jsx-runtime';
import { ReactNode } from 'react';

import { ProjectMedal } from '../ProjectMedal';
import { VotingChip } from '../VotingChip';

import { StyledHeader, StyledList } from './CategoryLeaderboard.style';

const Trapezoid = () => (
  <svg
    fill='none'
    height='50'
    style={{ marginBottom: '-2px' }}
    viewBox='0 0 293 50'
    width='293'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M0.5 12C0.5 5.64873 5.64873 0.5 12 0.5H218.08C221.101 0.5 224.001 1.689 226.153 3.80998L291.78 68.5H0.5V12Z'
      fill='#1E2430'
      stroke='#313846'
    />
  </svg>
);

type ProjectData = {
  name: string;
  votesCount: number;
  imgSrc: string;
};

type Props = { title: ReactNode; data: ProjectData[] };

type CategoryLeaderboardProps = Props;

const CategoryLeaderboard = ({ title, data }: CategoryLeaderboardProps): JSX.Element => {
  return (
    <Flex direction='column' style={{ position: 'relative' }}>
      <StyledHeader>{title}</StyledHeader>
      <Trapezoid />
      <StyledList borderColor='grey-300' gap='md' paddingX='md' paddingY='lg'>
        {data.map((item, idx) => (
          <Fragment key={idx}>
            <Flex alignItems='center' gap='xl' justifyContent='space-between'>
              <Flex alignItems='center' gap='xl'>
                <ProjectMedal position={idx + 1} />
                <Avatar borderColor='grey-200' rounded='md' size='6xl' src={item.imgSrc} />
                <P>{item.name}</P>
              </Flex>
              <VotingChip iconPlacement='end'>{item.votesCount}</VotingChip>
            </Flex>
            {idx !== data.length - 1 && <Divider />}
          </Fragment>
        ))}
      </StyledList>
    </Flex>
  );
};

export { CategoryLeaderboard };
