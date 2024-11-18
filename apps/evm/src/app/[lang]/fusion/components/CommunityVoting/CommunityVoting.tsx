import { Button, Chip, Flex, H2, Link, P, Skeleton, SolidClock, useMediaQuery } from '@gobob/ui';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from 'styled-components';
import { t, Trans } from '@lingui/macro';
import { useIsClient } from 'usehooks-ts';
import Image from 'next/image';
import appsLeaderboardHero from '@public/assets/apps-leaderboard-hero.png';
import { useLingui } from '@lingui/react';

import { StyledCard, StyledOpacityOverlay, StyledSpice } from './CommunityVoting.style';

import { useGetVotingApps } from '@/app/[lang]/apps/hooks';
import { RoutesPath } from '@/constants';

type CommunityVotingProps = object;

const CommunityVoting = ({}: CommunityVotingProps) => {
  const theme = useTheme();
  const isClient = useIsClient();
  const isMobile = useMediaQuery(theme.breakpoints.down('s'));
  const { data: votingAppsData } = useGetVotingApps();
  const { i18n } = useLingui();

  return (
    <Flex direction={{ base: 'column-reverse', s: 'row' }} gap='3xl' marginTop='8xl'>
      {isClient && !isMobile && (
        <StyledCard borderColor='grey-300' flex={0.4}>
          <Image
            fill
            alt={t(i18n)`Apps leaderboard hero`}
            placeholder='blur'
            quality={100}
            sizes='100vw'
            src={appsLeaderboardHero}
            style={{
              objectFit: 'cover'
            }}
          />
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
            <Trans>{formatDistanceToNow(votingAppsData.roundEndsAt)} until voting round ends</Trans>
          </Chip>
        ) : (
          <Skeleton height='3xl' width='9xl' />
        )}
        <H2 size='3xl'>
          <Trans>Community Voting</Trans>
        </H2>
        <P color='grey-50'>
          <Trans>
            Use your Spice total to support your favourite BOB builders. Winners will be announced each week.
          </Trans>
        </P>
        <Button elementType={Link} size='xl' variant='outline' {...{ href: RoutesPath.APPS }}>
          <Trans>Vote</Trans>
        </Button>
      </Flex>
    </Flex>
  );
};

export { CommunityVoting };
