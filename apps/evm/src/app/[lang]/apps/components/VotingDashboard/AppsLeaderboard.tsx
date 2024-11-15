import { Avatar, Divider, Flex, Skeleton } from '@gobob/ui';
import { Fragment } from 'react/jsx-runtime';
import { ReactNode } from 'react';
import { useTheme } from 'styled-components';

import { Medal } from '../Medal';
import { SpiceChip } from '../SpiceChip';
import { VotingAppData } from '../../hooks';

import {
  StyledH3,
  StyledHeaderWrapper,
  StyledList,
  StyledHeader,
  StyledWrapper,
  StyledName,
  StyledTrapezoid,
  StyledNameWrapper
} from './AppsLeaderboard.style';

const Trapezoid = () => {
  const theme = useTheme();

  return (
    <StyledTrapezoid fill='none' viewBox='0 0 49 48' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M0.5 0.5H12.349C16.3141 0.5 19.9995 2.54263 22.101 5.90501L48.0979 47.5H0.5V0.5Z'
        fill={theme.color('grey-400')}
        stroke={theme.color('grey-300')}
      />
    </StyledTrapezoid>
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
    <StyledWrapper direction='column' flex={1}>
      <StyledHeader alignItems='center'>
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
      </StyledHeader>
      <StyledList borderColor='grey-300' gap='md' paddingX='lg' paddingY='lg'>
        {isLoading || !data
          ? [...Array(5).fill(null)].map((_, idx) => (
              <Fragment key={idx}>
                <Flex alignItems='center' gap='s' justifyContent='space-between'>
                  <StyledNameWrapper alignItems='center' flex={1} gap={{ base: 'md', s: 'xl' }}>
                    <Medal position={idx + 1} />
                    <Skeleton height={{ base: '5xl', s: '6xl' }} width={{ base: '5xl', s: '6xl' }} />
                    <Skeleton flex={0.5} />
                  </StyledNameWrapper>
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
                    <StyledNameWrapper alignItems='center' flex={1} gap={{ base: 'md', s: 'xl' }}>
                      <Medal position={idx + 1} />
                      <Avatar borderColor='grey-200' rounded='md' size={{ base: '5xl', s: '6xl' }} src={item.logoSrc} />
                      <StyledName noWrap>{item.name}</StyledName>
                    </StyledNameWrapper>
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
    </StyledWrapper>
  );
};

export { AppsLeaderboard };
