import { Spice } from '@gobob/icons';
import {
  ArrowRight,
  Bars3,
  Button,
  Divider,
  Flex,
  H3,
  Link,
  P,
  SolidDocumentDuplicate,
  Span,
  useLocale
} from '@gobob/ui';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCopyToClipboard } from '@uidotdev/usehooks';

import { QuestS3Response, UserResponse } from '../../../../utils';
import { AppData } from '../../../Apps/hooks';
import { LoginSection } from '../../../../components';
import { L2_CHAIN, RoutesPath } from '../../../../constants';
import { useTotalBalance } from '../../../../hooks';

import { StyledDl, StyledLoginCard, StyledOverlay, StyledUnderlay } from './UserInfo.style';
import { UserInfoCard } from './UserInfoCard';
import { UserAssetsModal } from './UserAssetsModal';
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

  const { formatted } = useTotalBalance(L2_CHAIN);

  const [isUserAssetsModalOpen, setUserAssetsModalOpen] = useState(false);
  const [isUserAppsModalOpen, setUserAppsModalOpen] = useState(false);
  const [isUserReferralModalOpen, setUserReferralModalOpen] = useState(false);

  const spicePerDay = user?.season3Data.oneDayLeaderboardEntry[0].total_points;

  const harvestedApps = apps?.filter((app) => app.userHarvest);

  const completedQuestsCount = quests?.questBreakdown.filter((quest) => quest.quest_completed).length;

  const hasReferrals = Number(user?.season3Data.s3LeaderboardData[0].ref_points) > 0;

  return (
    <div style={{ position: 'relative' }}>
      <StyledDl
        aria-hidden={!isAuthenticated && 'true'}
        direction={{ base: 'column', md: 'row' }}
        gap='lg'
        marginTop='5xl'
      >
        <UserInfoCard description={formatted} title='Assets Deposited'>
          <Flex gap='md' marginTop='xl'>
            <Button disabled={!isAuthenticated} variant='outline' onPress={() => setUserAssetsModalOpen(true)}>
              <Bars3 />
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
        <UserInfoCard description={harvestedApps?.length || 0} title='Apps Used' tooltipLabel='TBD'>
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
              <ArrowRight size='xs' strokeWidth='2' style={{ marginLeft: 4 }} />
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
        <UserInfoCard description={completedQuestsCount || 0} title='Challenges Solved' tooltipLabel='TBD'>
          <Button
            fullWidth
            disabled={!isAuthenticated}
            variant='outline'
            onPress={() => navigate(RoutesPath.FUSION, { state: { scrollChallenges: true } })}
          >
            Solve Challenges
          </Button>
        </UserInfoCard>
        <UserInfoCard description={user?.referral_code} title='Your Referral Code' tooltipLabel='TBD'>
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
              Copy <SolidDocumentDuplicate size='xs' style={{ marginLeft: 4 }} />
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
        <UserInfoCard
          description={
            <Flex direction='column' elementType='span' gap='xs'>
              <Span size='inherit'>
                {Intl.NumberFormat(locale, { notation: 'compact' }).format(
                  user?.season3Data.s3LeaderboardData[0].total_points || 0
                )}
              </Span>
              <Flex elementType='span' gap='xs'>
                <Spice size='xs' />
                <Span size='xs'>
                  (+{Intl.NumberFormat(locale, { notation: 'compact' }).format(spicePerDay || 0)}/Day)
                </Span>
              </Flex>
            </Flex>
          }
          flex={1.3}
          title='Season 3 Harvested Spice'
          tooltipLabel='TBD'
        />
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
                Set sail on your Season 3 adventure, charting new territories and harvesting Spice along the way.
              </P>
              <Button asChild color='primary' elementType={Link} size='xl' {...{ href: RoutesPath.SIGN_UP }}>
                Start Harvesting Spice
              </Button>
              <LoginSection direction={{ base: 'column', s: 'row' }} />
            </StyledLoginCard>
          </StyledOverlay>
        </>
      )}
    </div>
  );
};

export { UserInfo };
