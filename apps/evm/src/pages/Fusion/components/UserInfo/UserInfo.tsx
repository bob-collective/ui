import {
  Bars3,
  Button,
  Divider,
  DlGroup,
  Dt,
  Flex,
  H3,
  Link,
  P,
  Skeleton,
  Span,
  useLocale,
  useMediaQuery
} from '@gobob/ui';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCopyToClipboard } from '@uidotdev/usehooks';
import { useTheme } from 'styled-components';
import { INTERVAL, useQuery } from '@gobob/react-query';
import { Spice } from '@gobob/icons';

import { apiClient, QuestS3Response, UserResponse } from '../../../../utils';
import { AppData } from '../../../Apps/hooks';
import { LoginSection } from '../../../../components';
import { RoutesPath } from '../../../../constants';
import { fusionKeys } from '../../../../lib/react-query';

import {
  StyledArrowRight,
  StyledDl,
  StyledLoginCard,
  StyledMainInfo,
  StyledMeterCard,
  StyledOverlay,
  StyledSolidDocumentDuplicate,
  StyledUnderlay,
  StyledUserInfoWrapper
} from './UserInfo.style';
import { UserInfoCard } from './UserInfoCard';
import { UserAppsModal } from './UsedAppsModal';
import { UserReferralModal } from './UserReferralModal';
import { Barometer } from './Barometer';
import { MultipliersModal } from './MultipliersModal';

type UserInfoProps = {
  user?: UserResponse;
  apps: AppData[] | undefined;
  quests: QuestS3Response | undefined;
  isAuthenticated?: boolean;
};

const UserInfo = ({ apps, user, quests, isAuthenticated }: UserInfoProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('s'));
  const { locale } = useLocale();
  const navigate = useNavigate();
  const [, copy] = useCopyToClipboard();

  const { data: tvlLevel } = useQuery({
    queryKey: fusionKeys.tvlLevel(),
    queryFn: () => apiClient.getLevelData(),
    refetchInterval: INTERVAL.MINUTE,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  const [isMultipliersModalOpen, setMultipliersModalOpen] = useState(false);
  const [isUserAppsModalOpen, setUserAppsModalOpen] = useState(false);
  const [isUserReferralModalOpen, setUserReferralModalOpen] = useState(false);

  const spicePerDay = user?.season3Data.oneDayLeaderboardEntry[0].total_points;

  const harvestedApps = apps?.filter((app) => app.userHarvest);

  const completedQuestsCount = quests?.questBreakdown.filter((quest) => quest.quest_completed).length;

  const hasReferrals = Number(user?.season3Data.s3LeaderboardData[0].ref_points) > 0;

  const totalPoints = user?.season3Data.s3LeaderboardData[0].total_points || 0;

  const currentLevelTvlGoal = tvlLevel?.tvlGoal ? Number(tvlLevel?.tvlGoal) : 0;

  return (
    <StyledUserInfoWrapper direction='column' marginTop='4xl'>
      <StyledDl aria-hidden={!isAuthenticated && 'true'} gap='lg'>
        <StyledMainInfo direction={{ base: 'column', s: 'row' }} flex={1}>
          <Flex direction='column' flex={1} gap='lg' justifyContent='space-between'>
            <DlGroup alignItems='flex-start' direction='column'>
              <Dt>Season 3 Harvested Spice</Dt>
              <Flex alignItems='flex-start' direction={{ base: 'column' }} elementType='dd'>
                <Flex alignItems='center' elementType={Span} gap='s' {...{ size: '4xl' }}>
                  {Intl.NumberFormat(locale, { maximumFractionDigits: isMobile ? 0 : 2 }).format(totalPoints)}
                  <Spice size='md' />
                </Flex>
                <Flex alignItems='center' color='grey-50' elementType={Span} gap='xxs' {...{ size: 's' }}>
                  (+{Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(spicePerDay || 0)}
                  <Spice size='xs' />
                  /Day)
                </Flex>
              </Flex>
            </DlGroup>
            <DlGroup wrap alignItems='center' gap='xs'>
              <Dt size='s'>Season 1 & 2 Total Spice (Completed):</Dt>
              <Flex alignItems='center' elementType='dd' gap='xs'>
                <Spice size='xs' />
                <Span size='xs'>
                  {Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(
                    user?.leaderboardRank.total_points || 0
                  )}
                </Span>
              </Flex>
            </DlGroup>
          </Flex>
          <Flex
            alignItems='center'
            flex={1}
            gap='md'
            justifyContent={{ base: 'center', s: 'flex-end' }}
            marginTop='2xl'
          >
            <Button variant='outline' onPress={() => setMultipliersModalOpen(true)}>
              View Multipliers
            </Button>
            <Button color='primary' elementType={Link} {...{ href: RoutesPath.BRIDGE }}>
              Bridge Assets
            </Button>
            <MultipliersModal isOpen={isMultipliersModalOpen} onClose={() => setMultipliersModalOpen(false)} />
          </Flex>
        </StyledMainInfo>
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
        <UserInfoCard description={user?.referral_code} title='Your Referral Code'>
          <Flex gap='md' marginTop='xl'>
            {hasReferrals && (
              <Button disabled={!isAuthenticated} variant='outline' onPress={() => setUserReferralModalOpen(true)}>
                <Bars3 />
              </Button>
            )}
            <Button
              isIconOnly
              disabled={!isAuthenticated}
              variant='outline'
              onPress={() => copy(user?.referral_code || '')}
            >
              <StyledSolidDocumentDuplicate size='xs' />
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
        <StyledMeterCard gap='s' justifyContent='space-between'>
          <Flex direction='column'>
            {tvlLevel ? (
              <>
                <Dt color='light' size='2xl'>
                  {tvlLevel?.levelName}
                </Dt>
                <Span size='s'>{tvlLevel?.levelDescription}</Span>
              </>
            ) : (
              <Flex direction='column'>
                <Skeleton height='3xl' width='10xl' />
                <Skeleton marginTop='s' width='50%' />
              </Flex>
            )}
          </Flex>
          <Barometer maxValue={currentLevelTvlGoal} value={tvlLevel !== undefined ? Number(tvlLevel?.currentTvl) : 0} />
        </StyledMeterCard>
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
