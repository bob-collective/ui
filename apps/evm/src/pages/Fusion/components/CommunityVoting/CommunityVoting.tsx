import { Button, Chip, Flex, H2, Link, P, Skeleton, SolidClock, useMediaQuery } from '@gobob/ui';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';

import { useGetVotingApps } from '../../../Apps/hooks';
import { RoutesPath } from '../../../../constants';

import { StyledCard, StyledOpacityOverlay, StyledSpice } from './CommunityVoting.style';

type CommunityVotingProps = {};

const CommunityVoting = ({}: CommunityVotingProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('s'));
  const { data: votingAppsData } = useGetVotingApps();

  const { t } = useTranslation();

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
            {t('fusion.communityVoting.roundEnd', { timeRemaining: formatDistanceToNow(votingAppsData.roundEndsAt) })}
          </Chip>
        ) : (
          <Skeleton height='3xl' width='9xl' />
        )}
        <H2 size='3xl'>{t('fusion.communityVoting.title')}</H2>
        <P color='grey-50'>{t('fusion.communityVoting.description')}</P>
        <Button elementType={Link} size='xl' variant='outline' {...{ href: RoutesPath.APPS }}>
          {t('fusion.communityVoting.cta')}
        </Button>
      </Flex>
    </Flex>
  );
};

export { CommunityVoting };
