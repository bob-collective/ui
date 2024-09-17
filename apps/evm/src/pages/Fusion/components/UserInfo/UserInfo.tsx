import { Spice } from '@gobob/icons';
import { Bars3, Button, Divider, DlGroup, Dt, Flex, H3, Link, P, Span, useLocale } from '@gobob/ui';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCopyToClipboard } from '@uidotdev/usehooks';

import { QuestS3Response, UserResponse } from '../../../../utils';
import { AppData } from '../../../Apps/hooks';
import { LoginSection } from '../../../../components';
import { RoutesPath } from '../../../../constants';

import {
  StyledArrowRight,
  StyledDl,
  StyledLoginCard,
  StyledOverlay,
  StyledSolidDocumentDuplicate,
  StyledUnderlay,
  StyledUserInfoWrapper
} from './UserInfo.style';
import { UserInfoCard } from './UserInfoCard';
import { UserAppsModal } from './UsedAppsModal';
import { UserReferralModal } from './UserReferralModal';
import { UserAssetsModal } from './UserAssetsModal';

type UserInfoProps = {
  user?: UserResponse;
  apps: AppData[] | undefined;
  quests: QuestS3Response | undefined;
  isAuthenticated?: boolean;
};

const UserInfo = ({ apps, user, quests, isAuthenticated }: UserInfoProps) => {
  const { locale } = useLocale();
  const navigate = useNavigate();
  const [, copy] = useCopyToClipboard();

  const [isUserAssetsModalOpen, setUserAssetsModalOpen] = useState(false);
  const [isUserAppsModalOpen, setUserAppsModalOpen] = useState(false);
  const [isUserReferralModalOpen, setUserReferralModalOpen] = useState(false);

  const spicePerDay = user?.season3Data.oneDayLeaderboardEntry[0].total_points;

  const harvestedApps = apps?.filter((app) => app.userHarvest);

  const completedQuestsCount = quests?.questBreakdown.filter((quest) => quest.quest_completed).length;

  const hasReferrals = Number(user?.season3Data.s3LeaderboardData[0].ref_points) > 0;

  return (
    <StyledUserInfoWrapper>
      <StyledDl
        aria-hidden={!isAuthenticated && 'true'}
        direction={{ base: 'column', md: 'row' }}
        gap='lg'
        marginTop={{ base: '4xl', md: '6xl' }}
      >
        <UserInfoCard
          description={
            <Flex alignItems='center' elementType='span' gap='s'>
              <Spice size='md' />
              <Span size='inherit'>
                {Intl.NumberFormat(locale).format(user?.season3Data.s3LeaderboardData[0].total_points || 0)}
              </Span>
              <Span size='xs'>
                (+{Intl.NumberFormat(locale, { notation: 'compact' }).format(spicePerDay || 0)}/Day)
              </Span>
            </Flex>
          }
          flex={2}
          title='Season 3 Harvested Spice'
        >
          <DlGroup alignItems='center'>
            <Dt size='s'>Season 1 & 2 (Completed):</Dt>
            <Flex alignItems='center' elementType='dd' gap='xs'>
              <Spice size='xs' />
              <Span size='xs'>{Intl.NumberFormat(locale).format(user?.leaderboardRank.total_points || 0)}</Span>
            </Flex>
          </DlGroup>
          <Flex gap='md'>
            <Button
              fullWidth
              disabled={!isAuthenticated}
              variant='outline'
              onPress={() => setUserAssetsModalOpen(true)}
            >
              View Multipliers
            </Button>
            <Button
              fullWidth
              color='primary'
              elementType={Link}
              tabIndex={isAuthenticated ? undefined : -1}
              {...{ href: RoutesPath.BRIDGE, isDisabled: !isAuthenticated }}
            >
              Bridge More
            </Button>
          </Flex>
          <UserAssetsModal isOpen={isUserAssetsModalOpen} onClose={() => setUserAssetsModalOpen(false)} />
        </UserInfoCard>
        <UserInfoCard description={user?.referral_code} title='Your Referral Code'>
          <Flex gap='md' marginTop='xl'>
            {hasReferrals && (
              <Button disabled={!isAuthenticated} variant='outline' onPress={() => setUserReferralModalOpen(true)}>
                <Bars3 />
              </Button>
            )}
            <Button
              fullWidth
              disabled={!isAuthenticated}
              variant='outline'
              onPress={() => copy(user?.referral_code || '')}
            >
              Copy <StyledSolidDocumentDuplicate size='xs' />
            </Button>
          </Flex>
          {user && hasReferrals && (
            <UserReferralModal
              isOpen={isUserReferralModalOpen}
              user={user}
              onClose={() => setUserReferralModalOpen(false)}
            />
          )}
        </UserInfoCard>
        <UserInfoCard description={harvestedApps?.length || 0} title='Apps Used'>
          <Flex gap='md' marginTop='xl'>
            {!!harvestedApps?.length && (
              <Button disabled={!isAuthenticated} variant='outline' onPress={() => setUserAppsModalOpen(true)}>
                <Bars3 />
              </Button>
            )}
            <Button
              fullWidth
              disabled={!isAuthenticated}
              elementType={Link}
              tabIndex={isAuthenticated ? undefined : -1}
              variant='outline'
              {...{ href: RoutesPath.APPS, isDisabled: !isAuthenticated }}
            >
              Use Apps
              <StyledArrowRight size='xs' strokeWidth='2' />
            </Button>
          </Flex>
          {!!harvestedApps?.length && (
            <UserAppsModal
              apps={harvestedApps}
              isOpen={isUserAppsModalOpen}
              onClose={() => setUserAppsModalOpen(false)}
            />
          )}
        </UserInfoCard>
        <UserInfoCard description={completedQuestsCount || 0} title='Challenges Solved'>
          <Button
            fullWidth
            disabled={!isAuthenticated}
            variant='outline'
            onPress={() => navigate(RoutesPath.FUSION, { state: { scrollChallenges: true } })}
          >
            Solve Challenges
          </Button>
        </UserInfoCard>
      </StyledDl>
      {!isAuthenticated && (
        <>
          <StyledUnderlay />
          <StyledOverlay alignItems='center' justifyContent='center'>
            <StyledLoginCard shadowed borderColor='grey-300' gap='lg'>
              <H3 align='center' size='md'>
                Log in to View Dashboard
              </H3>
              <Divider />
              <P align='center' color='grey-50' size='s'>
                Grab the final opportunity to harvest Spice. Join Season 3.
              </P>
              <Button asChild color='primary' elementType={Link} size='xl' {...{ href: RoutesPath.SIGN_UP }}>
                Start Harvesting Spice
              </Button>
              <LoginSection direction={{ base: 'column', s: 'row' }} />
            </StyledLoginCard>
          </StyledOverlay>
        </>
      )}
    </StyledUserInfoWrapper>
  );
};

export { UserInfo };
