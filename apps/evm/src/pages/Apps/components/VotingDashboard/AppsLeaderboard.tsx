import { Avatar, Divider, Flex, P, Skeleton } from '@gobob/ui';
import { Fragment } from 'react/jsx-runtime';
import { ReactNode } from 'react';
import { useTheme } from 'styled-components';

import { Medal } from '../Medal';
import { SpiceChip } from '../SpiceChip';
import { VotingAppData } from '../../hooks';

import { StyledH3, StyledHeaderWrapper, StyledList, StyledWrapper } from './AppsLeaderboard.style';

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

type Props = {
  title: ReactNode;
  data?: VotingAppData[];
  isLoading?: boolean;
  onVote?: (app: VotingAppData) => void;
  isVotingDisabled?: boolean;
  isVotingExceeded?: boolean;
};

type AppsLeaderboardProps = Props;

const AppsLeaderboard = ({
  title,
  data,
  isLoading,
  isVotingDisabled,
  isVotingExceeded,
  onVote
}: AppsLeaderboardProps): JSX.Element => {
  return (
    <Flex direction='column' flex={1} style={{ overflow: 'hidden' }}>
      <StyledWrapper alignItems='center'>
        <StyledHeaderWrapper borderColor='grey-300' justifyContent='center' padding='none' paddingLeft='2xl'>
          {title ? (
            <StyledH3 noWrap size='md'>
              {title}
            </StyledH3>
          ) : (
            <Skeleton width='8xl' />
          )}
        </StyledHeaderWrapper>
        <Trapezoid />
      </StyledWrapper>
      <StyledList borderColor='grey-300' gap='md' paddingX='lg' paddingY='lg'>
        {isLoading || !data
          ? [...Array(5).fill(null)].map((_, idx) => (
              <Fragment key={idx}>
                <Flex alignItems='center' gap='s' justifyContent='space-between'>
                  <Flex alignItems='center' flex={1} gap={{ base: 'md', s: 'xl' }} style={{ overflow: 'hidden' }}>
                    <Medal position={idx + 1} />
                    <Skeleton height={{ base: '5xl', s: '6xl' }} width={{ base: '5xl', s: '6xl' }} />
                    <Skeleton flex={0.5} />
                  </Flex>
                  <Skeleton height='3xl' rounded='full' width='6xl' />
                </Flex>
                {idx < 4 && <Divider />}
              </Fragment>
            ))
          : data
              .sort((a, b) => b.weight - a.weight)
              .map((item, idx, array) => (
                <Fragment key={idx}>
                  <Flex alignItems='center' gap='s' justifyContent='space-between'>
                    <Flex alignItems='center' flex={1} gap={{ base: 'md', s: 'xl' }} style={{ overflow: 'hidden' }}>
                      <Medal position={idx + 1} />
                      <Avatar borderColor='grey-200' rounded='md' size={{ base: '5xl', s: '6xl' }} src={item.logoSrc} />
                      <P noWrap style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </P>
                    </Flex>
                    <SpiceChip
                      amount={item.weight}
                      iconPlacement='end'
                      isDisabled={isVotingDisabled}
                      isLit={item.userHasVotedFor}
                      isVotingExceeded={isVotingExceeded}
                      onPress={() => onVote?.(item)}
                    />
                  </Flex>
                  {idx < array.length - 1 && <Divider />}
                </Fragment>
              ))}
      </StyledList>
    </Flex>
  );
};

export { AppsLeaderboard };
