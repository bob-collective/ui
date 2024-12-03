import { Button, Chip, Flex, H2, Link, P, Skeleton, SolidClock, useMediaQuery } from '@gobob/ui';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from 'styled-components';
import { Trans } from '@lingui/macro';
import { useIsClient } from 'usehooks-ts';
import { useParams } from 'next/navigation';

import { StyledCard, StyledOpacityOverlay, StyledSpice } from './CommunityVoting.style';

import { useGetVotingApps } from '@/app/[lang]/apps/hooks';
import { RoutesPath } from '@/constants';
import { getLocale } from '@/utils';

type CommunityVotingProps = object;

const CommunityVoting = ({}: CommunityVotingProps) => {
  const theme = useTheme();
  const isClient = useIsClient();
  const isMobile = useMediaQuery(theme.breakpoints.down('s'));
  const { lang } = useParams();
  const { data: votingAppsData } = useGetVotingApps();

  return (
    <Flex direction={{ base: 'column-reverse', s: 'row' }} gap='3xl' marginTop='8xl'>
      {isClient && !isMobile && (
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
            <Trans>
              {formatDistanceToNow(votingAppsData.roundEndsAt, {
                locale: getLocale(lang as Parameters<typeof getLocale>[0])
              })}{' '}
              until voting round ends
            </Trans>
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
