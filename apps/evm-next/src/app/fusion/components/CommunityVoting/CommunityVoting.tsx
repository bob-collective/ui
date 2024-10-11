import { Button, Chip, Flex, H2, Link, P, Skeleton, SolidClock, useMediaQuery } from '@gobob/ui';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from 'styled-components';

import { StyledCard, StyledOpacityOverlay, StyledSpice } from './CommunityVoting.style';

import { useGetVotingApps } from '@/app/apps/hooks';
import { RoutesPath } from '@/constants';

type CommunityVotingProps = object;

const CommunityVoting = ({}: CommunityVotingProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('s'));
  const { data: votingAppsData } = useGetVotingApps();

  return (
    <Flex direction={{ base: 'column-reverse', s: 'row' }} gap='3xl' marginTop='8xl'>
      {!isMobile && (
        <StyledCard borderColor='grey-300' flex={0.4}>
          <StyledOpacityOverlay />
          <StyledSpice />
        </StyledCard>
      )}
      <Flex
        alignItems='flex-start'
        direction='column'
        flex={1.5}
        gap='lg'
        marginY={{ base: 'none', s: '4xl', md: '6xl' }}
      >
        {votingAppsData?.roundEndsAt ? (
          <Chip startAdornment={<SolidClock size='s' />}>
            {formatDistanceToNow(votingAppsData.roundEndsAt)} until voting round ends
          </Chip>
        ) : (
          <Skeleton height='3xl' width='9xl' />
        )}
        <H2 size='3xl'>Community Voting</H2>
        <P color='grey-50'>
          Use your Spice total to support your favourite BOB builders. Winners will be announced each week.
        </P>
        <Button elementType={Link} size='xl' variant='outline' {...{ href: RoutesPath.APPS }}>
          Vote
        </Button>
      </Flex>
    </Flex>
  );
};

export { CommunityVoting };
