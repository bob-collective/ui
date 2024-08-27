import { Avatar, Divider, Flex, P, useLocale } from '@gobob/ui';
import { Fragment } from 'react/jsx-runtime';
import { ReactNode } from 'react';
import { useTheme } from 'styled-components';

import { ProjectMedal } from '../ProjectMedal';
import { VotingChip } from '../VotingChip';

import { StyledH3, StyledHeaderWrapper, StyledList, StyledWrapper } from './CategoryLeaderboard.style';

const Trapezoid = () => {
  const theme = useTheme();

  return (
    <svg
      fill='none'
      style={{ marginLeft: -1, height: '3rem', flexShrink: 0, marginRight: 10 }}
      viewBox='0 0 49 48'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M0.5 0.5H12.349C16.3141 0.5 19.9995 2.54263 22.101 5.90501L48.0979 47.5H0.5V0.5Z'
        fill='#1E2430'
        stroke={theme.color('grey-300')}
      />
    </svg>
  );
};

type ProjectData = {
  name: string;
  votesCount: number;
  imgSrc: string;
};

type Props = { title: ReactNode; data: ProjectData[] };

type CategoryLeaderboardProps = Props;

const CategoryLeaderboard = ({ title, data }: CategoryLeaderboardProps): JSX.Element => {
  const { locale } = useLocale();

  return (
    <Flex direction='column' flex={1} style={{ overflow: 'hidden' }}>
      <StyledWrapper alignItems='center'>
        <StyledHeaderWrapper borderColor='grey-300' justifyContent='center' padding='none' paddingLeft='2xl'>
          <StyledH3 noWrap size='md'>
            {title}
          </StyledH3>
        </StyledHeaderWrapper>
        <Trapezoid />
      </StyledWrapper>
      <StyledList borderColor='grey-300' gap='md' paddingX='md' paddingY='lg'>
        {data.map((item, idx) => (
          <Fragment key={idx}>
            <Flex alignItems='center' gap='s' justifyContent='space-between'>
              <Flex alignItems='center' flex={1} gap={{ base: 'md', s: 'xl' }} style={{ overflow: 'hidden' }}>
                <ProjectMedal position={idx + 1} />
                <Avatar borderColor='grey-200' rounded='md' size={{ base: '5xl', s: '6xl' }} src={item.imgSrc} />
                <P noWrap style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.name}
                </P>
              </Flex>
              <VotingChip iconPlacement='end'>
                {Intl.NumberFormat(locale, { notation: 'compact' }).format(item.votesCount)}
              </VotingChip>
            </Flex>
            {idx !== data.length - 1 && <Divider />}
          </Fragment>
        ))}
      </StyledList>
    </Flex>
  );
};

export { CategoryLeaderboard };
