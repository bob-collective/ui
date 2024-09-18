import { Spice } from '@gobob/icons';
import { ArrowRight, Bars3, Button, Divider, Dl, DlGroup, Dt, Flex, H3, Link, P, Span, useLocale } from '@gobob/ui';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCopyToClipboard } from '@uidotdev/usehooks';

import { QuestS3Response, UserResponse } from '../../../../utils';
import { AppData } from '../../../Apps/hooks';
import { LoginSection } from '../../../../components';
import { RoutesPath } from '../../../../constants';
import { Barometer } from '../SeasonInfo/Barometer';

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

  const totalPoints = user?.season3Data.s3LeaderboardData[0].total_points || 0;

  const milestoneReward = totalPoints * 2;

  return (
    <StyledUserInfoWrapper direction='column'>
      <Dl flex={1}>
        <DlGroup alignItems='flex-start' direction='column' flex={1}>
          <Dt>Season 3 Harvested Spice</Dt>
          <Flex alignItems='center' elementType='dd' gap='s'>
            <Span size='4xl'>{Intl.NumberFormat(locale).format(totalPoints)}</Span>
            <Spice size='md' />
            <Span size='xs'>(+{Intl.NumberFormat(locale, { notation: 'compact' }).format(spicePerDay || 0)}/Day)</Span>
          </Flex>
        </DlGroup>
        <Flex alignSelf='center' color='grey-50' elementType={ArrowRight} />
        <DlGroup alignItems='flex-end' direction='column' flex={1}>
          <Dt>Early Bird 2x Spice Bonus</Dt>
          <Flex alignItems='flex-end' direction='column' elementType='dd' gap='s'>
            <Flex alignItems='center' elementType='dd' gap='s'>
              <Span size='4xl'>+{Intl.NumberFormat(locale).format(milestoneReward)}</Span>
              <Spice size='md' />
            </Flex>
            <Span color='grey-50'>Unlocks at $50M</Span>
          </Flex>
        </DlGroup>
      </Dl>
      <Barometer value={45000000} />
      <Dl>
        <DlGroup alignItems='center'>
          <Dt size='s'>Season 1 & 2 Total Spice (Completed):</Dt>
          <Flex alignItems='center' elementType='dd' gap='xs'>
            <Spice size='xs' />
            <Span size='xs'>{Intl.NumberFormat(locale).format(user?.leaderboardRank.total_points || 0)}</Span>
          </Flex>
        </DlGroup>
      </Dl>
      <StyledDl
        aria-hidden={!isAuthenticated && 'true'}
        direction={{ base: 'column', md: 'row' }}
        flex={1}
        gap='lg'
        marginTop={{ base: '4xl', md: '6xl' }}
      >
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
